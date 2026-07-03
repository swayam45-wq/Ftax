import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ResidencyCheckDto {
  @ApiPropertyOptional({ example: 2025, default: 2025 })
  @IsOptional()
  @IsInt()
  @Min(2020)
  @Max(2030)
  taxYear?: number;

  @ApiPropertyOptional({ example: 'F1', default: 'F1' })
  @IsOptional()
  @IsString()
  visaType?: string;

  @ApiPropertyOptional({ example: 3, description: 'How many calendar years have you been in F-1 status?' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  calendarYearsInUS: number = 1;
}
