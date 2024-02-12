import { Module } from '@nestjs/common';
import { DemandService } from './demand.service';

@Module({
  providers: [DemandService]
})
export class DemandModule {}
