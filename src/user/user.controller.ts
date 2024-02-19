import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Req, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseUtils } from 'libs/base/base.utils';
import { UserEntity } from './entities/user.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class UserController extends BaseUtils {
  constructor(private readonly userService: UserService) {
    super()
  }

  @MessagePattern("ALL_USERS")
  async getAllBasicData() {
    try {
      return await this.userService.findAll([], {id: true, email:true, firstname: true, lastname: true});
    } catch (error) {
      this._Ex("ALL_USERS", 400, error.message)
    }
  }

  @MessagePattern("INFOS_USER")
  async getInfosUserConnected(@Payload() userId:number) {
    try {
      return await this.userService.getOneById(userId, ["myOwnGroups", "tokens", "demands"]);
    } catch (error) {
      this._Ex("GET-INFO-USER-FAILED-CTRL", 400, error.message)
    }
  }

  @MessagePattern("MODIFY_USER")
  async update(@Payload(new ValidationPipe()) updateUserDto: UpdateUserDto):Promise<UserEntity> {
    try {
      const user:UserEntity = await this.userService.getOneById(updateUserDto.id, [], {id: true})
      if (!user) this._Ex("FAILED TO FIND USER", 400, "UC-NOT-FND");
      const result:UserEntity = await this.userService.update(user, updateUserDto);
      if (!result) this._Ex("FAILED TO UPDATE USER", 400, "UC-FAILED");
      return result;
    } catch (error) {
      this._Ex("UPD-USR-CTRL", 400, error.message)
    }
  }

  @MessagePattern("DELETE_USER")
  delete(@Payload() userId:number) {
    try {
      return this.userService.delete(userId);
    } catch (error) {
      this._Ex("DELETE-USER-CTRL", 400, error.message)
    } 
  }
}
