import { IsString, IsOptional, IsDateString, IsEnum, MaxLength, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { VisaType, DegreeType } from '@prisma/client';

export class UpdateProfileDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50) firstName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50) lastName?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dateOfBirth?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(2) passportCountry?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(2) nationality?: string;
  @ApiPropertyOptional({ enum: VisaType }) @IsOptional() @IsEnum(VisaType) visaType?: VisaType;
  @ApiPropertyOptional() @IsOptional() @IsDateString() visaStartDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() visaExpiryDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sevisId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() uicStudentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() department?: string;
  @ApiPropertyOptional({ enum: DegreeType }) @IsOptional() @IsEnum(DegreeType) degree?: DegreeType;
  @ApiPropertyOptional() @IsOptional() @IsDateString() programStartDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() expectedGraduation?: string;
  // Sensitive — will be encrypted before storage
  @ApiPropertyOptional({ description: 'SSN (9 digits, encrypted at rest)' }) @IsOptional() @IsString() ssn?: string;
  @ApiPropertyOptional({ description: 'ITIN (9 digits, encrypted at rest)' }) @IsOptional() @IsString() itin?: string;
}
