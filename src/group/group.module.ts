import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { DemandService } from 'src/demand/demand.service';
import { DemandEntity } from 'src/demand/entities/demand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupEntity, DemandEntity])],
  controllers: [GroupController],
  providers: [GroupService, DemandService],
  exports: [GroupService]
})
export class GroupModule {}
