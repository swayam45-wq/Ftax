import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EncryptionService } from '../common/encryption.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AddTravelDto } from './dto/add-travel.dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly encryption: EncryptionService,
  ) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profile not found');

    // Never return encrypted values directly
    return {
      ...profile,
      ssnEncrypted: undefined,
      itinEncrypted: undefined,
      completionPercentage: this.calculateCompletion(profile),
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const data: Record<string, unknown> = { ...dto };

    // Handle SSN encryption
    if (dto.ssn) {
      data.ssnEncrypted = this.encryption.encrypt(dto.ssn);
      data.hasSsn = true;
      delete data.ssn;
    }

    // Handle ITIN encryption
    if (dto.itin) {
      data.itinEncrypted = this.encryption.encrypt(dto.itin);
      data.hasItin = true;
      delete data.itin;
    }

    const updated = await this.prisma.profile.update({
      where: { userId },
      data,
    });

    return {
      ...updated,
      ssnEncrypted: undefined,
      itinEncrypted: undefined,
      completionPercentage: this.calculateCompletion(updated),
    };
  }

  async addTravel(userId: string, dto: AddTravelDto) {
    const departureDate = new Date(dto.departureDate);
    const returnDate = dto.returnDate ? new Date(dto.returnDate) : undefined;

    const daysOutside = returnDate
      ? Math.ceil((returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return this.prisma.travelHistory.create({
      data: {
        userId,
        departureDate,
        returnDate,
        destination: dto.destination,
        reason: dto.reason,
        daysOutside,
        isCurrentTrip: !dto.returnDate,
      },
    });
  }

  async getTravel(userId: string) {
    return this.prisma.travelHistory.findMany({
      where: { userId },
      orderBy: { departureDate: 'desc' },
    });
  }

  async deleteTravel(userId: string, id: string) {
    const entry = await this.prisma.travelHistory.findFirst({ where: { id, userId } });
    if (!entry) throw new NotFoundException('Travel entry not found');
    await this.prisma.travelHistory.delete({ where: { id } });
    return { message: 'Travel entry deleted' };
  }

  private calculateCompletion(profile: Record<string, unknown>): number {
    const fields = [
      'firstName', 'lastName', 'dateOfBirth', 'passportCountry',
      'visaType', 'sevisId', 'department', 'degree',
      'programStartDate', 'expectedGraduation',
    ];
    const filled = fields.filter((f) => profile[f] != null).length;
    return Math.round((filled / fields.length) * 100);
  }
}
