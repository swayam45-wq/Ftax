import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResidencyEngineService } from './residency-engine.service';
import { ResidencyCheckDto } from './dto/residency-check.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TaxService {
  private readonly CURRENT_TAX_YEAR = 2025;

  constructor(
    private readonly prisma: PrismaService,
    private readonly residencyEngine: ResidencyEngineService,
  ) {}

  async checkResidency(userId: string, dto: ResidencyCheckDto) {
    // Build days-in-US by year from travel history
    const travelHistory = await this.prisma.travelHistory.findMany({
      where: { userId },
      orderBy: { departureDate: 'asc' },
    });

    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    const arrivalDate = profile?.programStartDate || new Date();

    // Calculate days in US per year from travel history
    const daysInUSByYear = this.calculateDaysInUSByYear(
      arrivalDate,
      travelHistory,
      dto.taxYear || this.CURRENT_TAX_YEAR,
    );

    const result = this.residencyEngine.calculateResidency({
      visaType: dto.visaType || profile?.visaType || 'F1',
      arrivalDate,
      taxYear: dto.taxYear || this.CURRENT_TAX_YEAR,
      daysInUSByYear,
      calendarYearsInUS: dto.calendarYearsInUS,
    });

    // Save result to residency history
    await this.prisma.residencyHistory.create({
      data: {
        userId,
        visaType: (dto.visaType || 'F1') as any,
        startDate: new Date(`${dto.taxYear || this.CURRENT_TAX_YEAR}-01-01`),
        endDate: new Date(`${dto.taxYear || this.CURRENT_TAX_YEAR}-12-31`),
        status: result.status as any,
      },
    });

    return result;
  }

  async getCurrentRules() {
    const year = this.CURRENT_TAX_YEAR;
    const possiblePaths = [
      path.join(__dirname, '../../../../..', 'packages', 'rules', `${year}.json`),
      path.join(__dirname, '../../../..', 'packages', 'rules', `${year}.json`),
      path.join(process.cwd(), 'packages', 'rules', `${year}.json`),
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, 'utf-8');
        return JSON.parse(raw);
      }
    }

    return { year, message: 'Rule file not found' };
  }

  private calculateDaysInUSByYear(
    arrivalDate: Date,
    travelHistory: Array<{ departureDate: Date; returnDate: Date | null; daysOutside: number }>,
    targetYear: number,
  ): Record<number, number> {
    const result: Record<number, number> = {};

    for (let year = targetYear - 2; year <= targetYear; year++) {
      const yearStart = new Date(`${year}-01-01`);
      const yearEnd = new Date(`${year}-12-31`);

      // Total days in year where user was present
      const totalDaysInYear = arrivalDate <= yearEnd ? 365 : 0;
      let daysOutsideInYear = 0;

      for (const trip of travelHistory) {
        const tripEnd = trip.returnDate || new Date();
        // Calculate overlap between trip and this year
        const overlapStart = new Date(Math.max(trip.departureDate.getTime(), yearStart.getTime()));
        const overlapEnd = new Date(Math.min(tripEnd.getTime(), yearEnd.getTime()));

        if (overlapStart <= overlapEnd) {
          daysOutsideInYear += Math.ceil(
            (overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24),
          );
        }
      }

      result[year] = Math.max(0, Math.min(totalDaysInYear, totalDaysInYear - daysOutsideInYear));
    }

    return result;
  }
}
