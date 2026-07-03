import { Module } from '@nestjs/common';
import { TaxController } from './tax.controller';
import { TaxService } from './tax.service';
import { ResidencyEngineService } from './residency-engine.service';

@Module({
  controllers: [TaxController],
  providers: [TaxService, ResidencyEngineService],
  exports: [TaxService, ResidencyEngineService],
})
export class TaxModule {}
