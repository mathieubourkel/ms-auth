import { Controller, ValidationPipe } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { BaseUtils } from 'libs/base/base.utils';
import { GroupEntity } from './entities/group.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class GroupController extends BaseUtils {
  constructor(private readonly groupService: GroupService) {
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

  @MessagePattern("GET_ONE_GROUP")
  async getOneGroup(@Payload('idGroup') idGroup:number) {
    try {
      return await this.groupService.getOneById(idGroup, ['owner']);
    } catch (error) {
      this._Ex("UPD-GRP-CTRL", 400, error.message)
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
