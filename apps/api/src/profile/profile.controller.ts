import { Controller, Get, Put, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AddTravelDto } from './dto/add-travel.dto';

@ApiTags('profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get user profile with completion percentage' })
  async getProfile(@CurrentUser() user: any) {
    return this.profileService.getProfile(user.id);
  }

  @Put()
  @ApiOperation({ summary: 'Update profile information' })
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.profileService.updateProfile(user.id, dto);
  }

  @Post('travel')
  @ApiOperation({ summary: 'Add a travel history entry' })
  async addTravel(@CurrentUser() user: any, @Body() dto: AddTravelDto) {
    return this.profileService.addTravel(user.id, dto);
  }

  @Get('travel')
  @ApiOperation({ summary: 'Get all travel history entries' })
  async getTravel(@CurrentUser() user: any) {
    return this.profileService.getTravel(user.id);
  }

  @Delete('travel/:id')
  @ApiOperation({ summary: 'Delete a travel history entry' })
  async deleteTravel(@CurrentUser() user: any, @Param('id') id: string) {
    return this.profileService.deleteTravel(user.id, id);
  }
}
