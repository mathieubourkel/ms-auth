import { Module } from '@nestjs/common';
import { DemandService } from './demand.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandEntity } from './entities/demand.entity';
import { DemandController } from './demand.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DemandEntity])],
  providers: [DemandService],
  controllers: [DemandController],
  exports: [DemandService]
})
export class DemandModule {}
