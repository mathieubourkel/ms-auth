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
  async getAll() {
    try {
      return await this.userService.findAll([], {id: true, email:true, firstname: true, lastname: true});
    } catch (error) {
      this._catchEx(error)
    }
    
  }

  @MessagePattern("INFOS_USER")
  async getInfosUserConnected(@Payload() req:any) {
    try {
      return await this.userService.getOneById(+req.user.userId, ["myOwnGroups", "groups"], {id: true, email: true, firstname: true, lastname:true, groups: {id: true, name:true}, myOwnGroups:{id:true, name:true}});
    } catch (error) {
      this._catchEx(error)
    }
    
  }

  @MessagePattern("MODIFY_USER")
  async update(@Body(new ValidationPipe()) updateUserDto: UpdateUserDto, @Req() req:any):Promise<string> {
    try {
      const user:UserEntity = await this.userService.getOneById(+req.user.userId, [], {id: true})
      if (!user) this._Ex("FAILED TO FIND USER", 400, "UC-NOT-FND", "PUT /user");
      const result:UserEntity = await this.userService.update(user, updateUserDto);
      if (!result) this._Ex("FAILED TO UPDATE USER", 400, "UC-FAILED", "PUT /user");
      return "USER UPDATED SUCCESFUL"
    } catch (error) {
      this._catchEx(error)
    }
  }

  @MessagePattern("DELETE_USER")
  delete(@Payload() req:any) {
    try {
      return this.userService.delete(+req.user.userId);
    } catch (error) {
      this._catchEx(error)
    } 
  }
}
