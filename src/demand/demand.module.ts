import { Module } from '@nestjs/common';
import { DemandService } from './demand.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandEntity } from './entities/demand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DemandEntity])],
  providers: [DemandService],
  exports: [TypeOrmModule]
})
export class DemandModule {}
