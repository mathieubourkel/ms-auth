import { Controller, Get, Post, Body, Put, Res, Req, ValidationPipe } from '@nestjs/common';
import { TokensService } from '../tokens/tokens.service';
import { BaseUtils } from 'libs/base/base.utils';
import { __decryptPassword, __hashPassword } from 'libs/password/password.utils';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { TokensEntity } from 'src/tokens/entities/tokens.entity';
import * as jwt from "jsonwebtoken";
import { ResetPwdDto } from './dto/reset-pwd.dto';
import { GroupService } from 'src/group/group.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GroupEntity } from 'src/group/entities/group.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController extends BaseUtils {
  
  constructor(
    private readonly userService: UserService,
    private readonly tokensService: TokensService,
    private readonly groupService: GroupService
    ) {
    super()
  }

  @MessagePattern('LOGIN')
  async login(@Payload(new ValidationPipe()) loginDto: LoginDto)  {
    try {
      const user:UserEntity = await this.userService.getOneBySearchOptions({email:loginDto.email}, [], {id: true, email:true, password: true, firstname: true, lastname: true});
      if (!user) throw this._Ex("Bad Credentials", 401, "AC-LOG");
      if (!await __decryptPassword(loginDto.password, user.password)) this._Ex("Bad Credentials", 401, "AC-LOG-27");
      const { token, refreshToken } = await this.__createTokens(user.id, user.email);
      const tokens:any = await this.tokensService.getTokensBySearchOptions({user:{id: user.id}})
      if (tokens) {
        var result:any = await this.tokensService.update(tokens, {refreshToken, token})
      } else {
          var result:any = await this.tokensService.create({refreshToken, user, token, emailToken:""})
        }
      delete user.password;
      if (!result) this._Ex("Failed to Update", 500, "AC-LOG")
      return { token, user, refreshToken };
    } catch (error) {
      this._catchEx(error)
    }
  }

  @MessagePattern('REFRESH_TOKEN')
  async refreshToken(@Payload('userId') userId:number, @Payload('refreshToken') oldRefreshToken:string) {
    try {
      const tokens:TokensEntity = await this.tokensService.getTokensBySearchOptions({user: {id: userId}}, ["user"], {id: true, refreshToken: true, user: {id: true, email:true}});
      if (!tokens) throw this._Ex("No Tokens", 401, "AC-REFRESH");
      if (tokens.refreshToken != oldRefreshToken) this._Ex("Tokens does not match", 401, "AC-REFRESH-43");
      const {token, refreshToken} = await this.__createTokens(userId, tokens.user.email);
      const result = await this.tokensService.update(tokens, {refreshToken, token});
      if (!result) this._Ex("Failed to Refresh", 500, "AC-REFRESH")
      return result;
    } catch (error) {
      this._catchEx(error)
    }
  }

  @MessagePattern('REGISTER')
  async create(@Payload(new ValidationPipe()) createUserDto: CreateUserDto):Promise<unknown> {
    try {
      const userExist:{id:number} = await this.userService.getOneBySearchOptions({email: createUserDto.email}, [], {id: true});
      if (userExist) this._Ex("USER-ALRDY-EXIST", 400, "AC-RGS");
      const user:UserEntity = await this.userService.create({...createUserDto, password: await __hashPassword(createUserDto.password)});
      if (!user) this._Ex("FAILED-TO-CREATE-USER", 400, "AC-RGS");
      if (!createUserDto.name) return {id: user.id, firstname: user.firstname, email: user.email}
      const group:GroupEntity = await this.groupService.create({name: createUserDto.name, additionalInfos: createUserDto.additionalInfos, description: createUserDto.description, owner: user})
      return {user: {id: user.id, firstname: user.firstname, email: user.email}, group} 
    } catch (error) {
      this._catchEx(error)
    }
  }

  @MessagePattern('RESET_PWD')
  async resetPwd(@Payload(new ValidationPipe()) resetPwdDto: ResetPwdDto):Promise<string> {
    try {
      const user:UserEntity = await this.userService.getOneById(resetPwdDto.id, [], {id: true, password: true})
      if (!user) this._Ex("USR-NOT-AUTHENTIFIED", 401, "AC-RSTPWD");
      if (!await __decryptPassword(resetPwdDto.oldPassword, user.password)) this._Ex("BAD-CREDENTIALS", 400, "AC-76");
      const result = await this.userService.updatePassword(user, await __hashPassword(resetPwdDto.newPassword));
      if (!result) this._Ex("FAILED TO RESET PWD", 400, "AC-RSTPWD")
      return "PWD UPDATED WITH SUCCESS"
    } catch (error) {
      this._catchEx(error)
    }
  }

  __createTokens = async (userId: number, email: string) => {
    let date:Date = new Date();
    const tokenDate:number = date.setHours(date.getHours() + 3)
    const refreshDate:number = date.setDate(date.getDate() + 4 * 7)
    const token:string = jwt.sign(
      { userId, email, exirationDate: tokenDate },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3h" }
    );
    const refreshToken:string = jwt.sign(
      { userId, email, exirationDate: refreshDate },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "4w" }
    );

    

    return {token, refreshToken}
  }
}
