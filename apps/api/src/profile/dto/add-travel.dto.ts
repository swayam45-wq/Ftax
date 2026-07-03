import { IsString, IsOptional, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddTravelDto {
  @ApiProperty({ example: '2025-06-01' })
  @IsDateString()
  @IsNotEmpty()
  departureDate: string;

  @ApiPropertyOptional({ example: '2025-08-15', description: 'Leave empty if still abroad' })
  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @ApiProperty({ example: 'India' })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ApiPropertyOptional({ example: 'Summer vacation' })
  @IsOptional()
  @IsString()
  reason?: string;
}
