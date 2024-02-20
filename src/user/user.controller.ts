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
      this._catchEx(error)
    }
  }

  @MessagePattern("GET_USER_BYID")
  async getUserById(@Payload() userId:number) {
    try {
      return await this.userService.getOneById(userId, ["myOwnGroups", "tokens", "demands"]);
    } catch (error) {
      this._catchEx(error)
    }
  }

  @MessagePattern("GET_USER_WITH_PWD")
  async getOneUser(@Payload() searchOption:{}) {
    try {
      return await this.userService.getOneBySearchOptions(searchOption, [], {id: true, password: true, email: true});
    } catch (error) {
      this._catchEx(error)
    }
  }

  @MessagePattern("GET_ONE_LIGHT_USER")
  async getOneLightUser(@Payload() searchOption:{}) {
    try {
      return await this.userService.getOneBySearchOptions(searchOption, [], {id: true, email: true});
    } catch (error) {
      this._catchEx(error)
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
      this._catchEx(error)
    }
  }

  @MessagePattern("DELETE_USER")
  delete(@Payload() userId:number) {
    try {
      return this.userService.delete(userId);
    } catch (error) {
      this._catchEx(error)
    } 
  }
}
