import { Controller, Get, Post, Body, Param, Delete, Put, Req, ValidationPipe } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { BaseUtils } from 'libs/base/base.utils';
import { GroupEntity } from './entities/group.entity';
import { DemandEntity } from 'src/demand/entities/demand.entity';
import { DemandService } from 'src/demand/demand.service';
import { CreateDemandDto } from 'src/demand/dto/create-demand.dto';
import { UpdateDemandDto } from 'src/demand/dto/update-demand.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class GroupController extends BaseUtils {
  constructor(
    private readonly groupService: GroupService,
    private readonly demandService: DemandService
    ) {
    super()
  }

  @MessagePattern("ADD_GROUP")
  async create(@Payload(new ValidationPipe()) createGroupDto: CreateGroupDto) {
    try {
      return await this.groupService.create(createGroupDto);
    } catch (error) {
      this._Ex("CREATE-GRP-CTRL", 400, error.message)
    }
  }

  @MessagePattern("ALL_GROUPS")
  async findAll() {
    try {
      return await this.groupService.findAll();
    } catch (error) {
      this._Ex("GET-ALL-CTRL", 400, error.message)
    }
  }

  @MessagePattern("MODIFY_GROUP")
  async update(@Payload('body', new ValidationPipe()) updateGroupDto: UpdateGroupDto, @Payload('userId') userId:number) {
    try {
      return await this.groupService.update(userId, updateGroupDto);
    } catch (error) {
      this._Ex("UPD-GRP-CTRL", 400, error.message)
    }
  }

  @MessagePattern("ADD_GROUP_DEMAND")
  async addGroupDemand(@Payload('body', new ValidationPipe()) createDemandDto: CreateDemandDto, @Payload('id') id:number):Promise<string> {
    try {
      const group:GroupEntity = await this.groupService.getOneById(createDemandDto.group.id);
      if (!group) this._Ex("COMPANY NOT FIND", 400, "GC-FAILED");
      const result = await this.demandService.create({user: {id}, group: {id: group.id}, status:0})
      if (!result) this._Ex("FAILED TO ADD DEMAND", 400, 'GC-FLD')
      return "REJOIN GROUP SUCCESFUL"
    } catch (error) {
      this._Ex("ADD-GRP-DMD-CTRL", 400, error.message)
    }
  }

  @MessagePattern("MODIFY_GROUP_DEMAND")
  async changeStatusDemand(@Payload('body', new ValidationPipe()) updateDemandDto: UpdateDemandDto, @Payload('id') id:number, @Payload('userId') userId:number):Promise<string> {
    try {
      const demand:DemandEntity = await this.demandService.getOneById(id, ["group", "group.owner"], {id: true, group: {id: true, owner:{id:true}}})
      if (!demand) this._Ex("DEMAND NOT FIND", 400, "GC-FAILED");
      if (demand.group.owner.id != userId) this._Ex("YOU DONT HAVE THE RIGHT", 403, "GC-FAILED")
      const result = await this.demandService.update(demand, updateDemandDto)
      if (!result) this._Ex("FAILED TO MODIFY DEMAND", 400, 'GC-FLD')
      return "CHANGE STATUS GROUP SUCCESFUL"
    } catch (error) {
      this._Ex("CHG-GRP-DMD-CTRL", 400, error.message)
    }
  }


  @MessagePattern("DELETE_GROUP")
  async remove(@Payload('groupId') groupId:number, @Payload('userId') userId:number) {
    try {
      const result:GroupEntity = await this.groupService.getOneById(groupId, ["owner"]);
      if (!result) this._Ex("CC-COMPANYT-NOTFIND", 400,"CC");
      if (result.owner.id !== userId) this._Ex("CC-NO-RIGHTS", 403, "NORIGHT");
      return await this.groupService.delete(result.id);
    } catch (error) {
      this._Ex("DEL-GRP-CTRL", 400, error.message)
    }
    
  }
}
