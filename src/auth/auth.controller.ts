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
import { ForgotPwdDto } from './dto/forgot-pwd.dto';
import { UserStatusEnum } from 'enums/user.status.enum';

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
      const user:UserEntity = await this.userService.getOneBySearchOptions({email:loginDto.email}, [], {id: true, email:true, password: true, firstname: true, lastname: true, status: true});
      if (!user) this._Ex("Bad Credentials", 401, "AC-LOG");
      if (user.status != 1) throw this._Ex("User Status NOT OK", 401, "/login")
      if (!await __decryptPassword(loginDto.password, user.password)) this._Ex("Bad Credentials", 401, "AC-LOG-27");
      const { token, refreshToken } = await this.__createTokens(user.id, user.email, user.firstname, user.lastname);
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
      const tokens:TokensEntity = await this.tokensService.getTokensBySearchOptions({user: {id: userId}}, ["user"], {id: true, refreshToken: true, user: {id: true, email:true, firstname: true, lastname: true}});
      if (!tokens) this._Ex("No Tokens", 401, "AC-REFRESH");
      if (tokens.refreshToken != oldRefreshToken) this._Ex("Tokens does not match", 401, "AC-REFRESH-43");
      const {token, refreshToken} = await this.__createTokens(userId, tokens.user.email, tokens.user.firstname, tokens.user.lastname);
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
      const validationToken = await this.__createValidationToken(user.id, user.email)
      if (!createUserDto.name) return {id: user.id, firstname: user.firstname, email: user.email, validationToken}
      const group:GroupEntity = await this.groupService.create({name: createUserDto.name, additionalInfos: createUserDto.additionalInfos, description: createUserDto.description, owner: user})
      return {user: {id: user.id, firstname: user.firstname, email: user.email}, group} 
    } catch (error) {
      this._catchEx(error)
    }
  }


  @MessagePattern('RESET_PWD')
  async resetPwd(@Payload(new ValidationPipe()) resetPwdDto: ResetPwdDto):Promise<string> {
    try {
      if (!await __decryptPassword(resetPwdDto.oldPwd, resetPwdDto.user.password)) this._Ex("FAILED TO RESET PWD", 400, "AC-76");
      const result = await this.userService.updatePassword(resetPwdDto.user, await __hashPassword(resetPwdDto.newPwd));
      if (!result) this._Ex("FAILED TO RESET PWD", 400, "AC-RSTPWD")
      return "PWD UPDATED WITH SUCCESS"
    } catch (error) {
      this._catchEx(error)
    }
  }

  @MessagePattern('VALIDATE_USER')
  async validateUser(@Payload() user:any):Promise<string> {
    try {
      const result = await this.userService.updateStatusUser(user, UserStatusEnum.ACTIVE);
      if (!result) this._Ex("FAILED TO VALIDATE USER", 400, "AC-RSTPWD")
      return "USER UPDATED WITH SUCCESS"
    } catch (error) {
      this._catchEx(error)
    }
  }

  @MessagePattern('RESET_PWD_WITHOUT_CHECK')
  async forgotPwd(@Payload(new ValidationPipe()) forgotPwdDto: ForgotPwdDto):Promise<string> {
    try {
      const result = await this.userService.updatePassword(forgotPwdDto.user, await __hashPassword(forgotPwdDto.newPwd));
      if (!result) this._Ex("FAILED TO RESET PWD", 400, "AC-RSTPWD")
      return "PWD UPDATED WITH SUCCESS"
    } catch (error) {
      this._catchEx(error)
    }
  }

  @MessagePattern("GET_USER_EMAIL_TOKEN")
  async getOneUserWithEmailToken(@Payload('email') email:string) {
    try {
      const user = await this.userService.getOneBySearchOptions({email: email}, [], {id: true, password: true, email: true});
      if (!user) this._Ex("MAIL SEND", 200, "CTRL/RST/PWD")
      const tokens:any = await this.tokensService.getTokensBySearchOptions({user:{id: user.id}})
      const result:any = await this.tokensService.update(tokens, {emailToken: await this.__createEmailToken(user.id, user.email)})
      return {user, emailToken:result.emailToken}
    } catch (error) {
      this._catchEx(error)
    }
  }

  __createEmailToken = async (userId: number, email:string) => {
    let date:Date = new Date();
    const emailDate:number = date.setHours(date.getHours() + 24)

    const emailToken:string = jwt.sign(
      { userId, email, exirationDate: emailDate },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    return emailToken
  }

  __createValidationToken = async (userId: number, email:string) => {
    let date:Date = new Date();
    const validationDate:number = date.setHours(date.getHours() + 24)

    const validationToken:string = jwt.sign(
      { userId, email, exirationDate: validationDate },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    return validationToken
  }


  __createTokens = async (userId: number, email: string, firstname: string, lastname:string) => {
    let date:Date = new Date();
    const tokenDate:number = date.setHours(date.getHours() + 24)
    const refreshDate:number = date.setDate(date.getDate() + 4 * 7)
    const token:string = jwt.sign(
      { userId, email, firstname, lastname, exirationDate: tokenDate },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    const refreshToken:string = jwt.sign(
      { userId, email, exirationDate: refreshDate },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "4w" }
    );

    return {token, refreshToken}
  }
}
