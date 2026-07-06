import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class SendOtpDto {
  @ApiProperty({ example: 'john.doe@uic.edu', description: 'Must be a @uic.edu email address' })
  @IsEmail({}, { message: 'Please enter a valid UIC email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;
}
