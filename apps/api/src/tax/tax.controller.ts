import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TaxService } from './tax.service';
import { ResidencyCheckDto } from './dto/residency-check.dto';

@ApiTags('tax')
@Controller('tax')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Post('residency-check')
  @ApiOperation({
    summary: 'Run residency determination engine',
    description: 'Determines Resident Alien vs Nonresident Alien status with plain English reasoning',
  })
  async checkResidency(@CurrentUser() user: any, @Body() dto: ResidencyCheckDto) {
    return this.taxService.checkResidency(user.id, dto);
  }

  @Get('rules/current')
  @ApiOperation({ summary: 'Get current year tax rules (for UI display)' })
  async getCurrentRules() {
    return this.taxService.getCurrentRules();
  }
}
