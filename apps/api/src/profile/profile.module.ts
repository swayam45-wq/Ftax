import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { EncryptionService } from '../common/encryption.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, EncryptionService],
  exports: [ProfileService],
})
export class ProfileModule {}
