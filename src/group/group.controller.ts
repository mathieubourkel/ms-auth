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

@Controller('group')
export class GroupController extends BaseUtils {
  constructor(
    private readonly groupService: GroupService,
    private readonly demandService: DemandService
    ) {
    super()
  }

  @Post()
  async create(@Body(new ValidationPipe()) createGroupDto: CreateGroupDto) {
    try {
      return await this.groupService.create(createGroupDto);
    } catch (error) {
      this._catchEx(error)
    }
  }

  @Get("all")
  async findAll() {
    try {
      return await this.groupService.findAll();
    } catch (error) {
      this._catchEx(error)
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    try {
      return await this.groupService.update(+id, updateGroupDto);
    } catch (error) {
      this._catchEx(error)
    }
  }

  @Put('demand/add')
  async addGroupDemand(@Body(new ValidationPipe()) createDemandDto: CreateDemandDto, @Req() req:any):Promise<string> {
    try {
      const group:GroupEntity = await this.groupService.getOneById(createDemandDto.group.id);
      if (!group) this._Ex("COMPANY NOT FIND", 400, "GC-FAILED", "PUT /group/demand/add");
      const result = await this.demandService.create({user: {id: +req.user.userId}, group: {id: group.id}, status:0})
      if (!result) this._Ex("FAILED TO ADD DEMAND", 400, 'GC-FLD', "/group/demand/add")
      return "REJOIN GROUP SUCCESFUL"
    } catch (error) {
      this._catchEx(error)
    }
  }

  @Put('demand/change-status/:id')
  async changeStatusDemand(@Body(new ValidationPipe()) updateDemandDto: UpdateDemandDto, @Req() req:any):Promise<string> {
    try {
      const demand:DemandEntity = await this.demandService.getOneById(+req.params.id, ["group", "group.owner"], {id: true, group: {id: true, owner:{id:true}}})
      if (!demand) this._Ex("DEMAND NOT FIND", 400, "GC-FAILED", "PUT /group/demand/change-status/:id");
      if (demand.group.owner.id != req.user.userId) this._Ex("YOU DONT HAVE THE RIGHT", 403, "GC-FAILED", "PUT /group/demand/changestatus")
      const result = await this.demandService.update(demand, updateDemandDto)
      if (!result) this._Ex("FAILED TO MODIFY DEMAND", 400, 'GC-FLD', "/group/demand/change-status/:id")
      return "CHANGE STATUS GROUP SUCCESFUL"
    } catch (error) {
      this._catchEx(error)
    }
  }


  @Delete(':id')
  async remove(@Req() req: any) {
    try {
      const result:GroupEntity = await this.groupService.getOneById(+req.user.userId, ["owner"]);
      if (!result) this._Ex("CC-COMPANYT-NOTFIND", 400,"CC","/group/:id");
      if (result.owner.id !== req.user.userId) this._Ex("CC-NO-RIGHTS", 403, "NORIGHT", "/group/:id");
      return await this.groupService.delete(result.id);
    } catch (error) {
      this._catchEx(error)
    }
    
  }
}
