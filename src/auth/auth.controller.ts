import { Controller, ValidationPipe } from '@nestjs/common';
import { TokensService } from '../tokens/tokens.service';
import { BaseUtils } from 'libs/base/base.utils';
import { __decryptPassword, __hashPassword } from 'libs/password/password.utils';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { TokensEntity } from 'src/tokens/entities/tokens.entity';
import { ResetPwdDto } from './dto/reset-pwd.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ForgotPwdDto } from './dto/forgot-pwd.dto';
import { UserStatusEnum } from 'enums/user.status.enum';
import { __createEmailToken, __createTokens, __createValidationToken } from 'src/tokens/tokens.utils';

@Controller()
export class AuthController extends BaseUtils {
  
  constructor(private readonly userService: UserService,
    private readonly tokensService: TokensService) {
    super()
  }

  @MessagePattern('LOGIN')
  async login(@Payload(new ValidationPipe()) loginDto: LoginDto)  {
    try {
      const user:UserEntity = await this.userService.getOneBySearchOptions({email:loginDto.email}, [], {id: true, email:true, password: true, firstname: true, lastname: true, status: true, count: true});
      if (!user) this._Ex("BAD-CREDENTIALS", 401, "MS-AUTH_AC_LOGIN");
      if (process.env.NODE_ENV === 'production' && user.status != 1) this._Ex("ACCOUNT NOT AUTHORIZED", 401, "MS-AUTH_AC_LOGIN")
      await this.userService.updateCountUser(user)
      if (user.count > 6) {
        await this.userService.updateStatusUser(user, UserStatusEnum.BLOCKED)
        this._Ex("ACCOUNT BLOCKED", 401, "MS-AUTH_AC_LOGIN")
      }
      if (!await __decryptPassword(loginDto.password, user.password)) this._Ex("BAD-CREDENTIALS", 401, "MS-AUTH_AC_LOGIN");
      const { token, refreshToken } = __createTokens(user.id, user.email, user.firstname, user.lastname);
      const tokens:any = await this.tokensService.getTokensBySearchOptions({user:{id: user.id}})
      await this.tokensService.update(tokens, {refreshToken, token})
      delete user.password;
      await this.userService.updateCountUser(user, true)
      return { token, user, refreshToken };
    } catch (error) {
      this._catchEx(error)
    }
  }

  @MessagePattern('REFRESH_TOKEN')
  async refreshToken(@Payload('userId') userId:number, @Payload('refreshToken') oldRefreshToken:string):Promise<TokensEntity> {
    try {
      const tokens:TokensEntity = await this.tokensService.getTokensBySearchOptions({user: {id: userId}}, ["user"], {id: true, refreshToken: true, user: {id: true, email:true, firstname: true, lastname: true}});
      if (!tokens) this._Ex("FAILED-TO-REFRESH", 401, "MS-AUTH_AC_REFRESH_TOKEN");
      if (tokens.refreshToken != oldRefreshToken) this._Ex("TOKENS DOESNT MATCH", 401, "MS-AUTH_AC_REFRESH_TOKEN");
      const {token, refreshToken} = __createTokens(userId, tokens.user.email, tokens.user.firstname, tokens.user.lastname);
      return await this.tokensService.update(tokens, {refreshToken, token});
    } catch (error) {
      this._catchEx(error)
    }
  }

  @MessagePattern('REGISTER')
  async create(@Payload(new ValidationPipe()) createUserDto: CreateUserDto):Promise<unknown> {
    try {
      const userExist:{id:number} = await this.userService.getOneBySearchOptions({email: createUserDto.email}, [], {id: true});
      if (userExist) this._Ex("USER-ALRDY-EXIST", 400, "MS-AUTH_REGISTER");
      const user:UserEntity = await this.userService.create({...createUserDto, password: await __hashPassword(createUserDto.password)});
      if (!user) this._Ex("FAILED-TO-CREATE-USER", 400, "MS-AUTH_REGISTER");
      const tokens = await this.tokensService.create({token:'', refreshToken:'', emailToken:'', validationToken: __createValidationToken(user.id, user.email), user:{id:user.id}})
      return {id: user.id, firstname: user.firstname, email: user.email, validationToken: tokens.validationToken}
    } catch (error) {
      this._catchEx(error)
    }
  }

  @MessagePattern('VALIDATE_USER')
  async validateUser(@Payload() user:UserEntity):Promise<string> {
    try {
      await this.userService.updateStatusUser(user, UserStatusEnum.ACTIVE);
      return "USER UPDATED WITH SUCCESS"
    } catch (error) {
      this._catchEx(error)
    }
  }

  @MessagePattern('RESET_PWD')
  async resetPwd(@Payload(new ValidationPipe()) resetPwdDto: ResetPwdDto):Promise<string> {
    try {
      if (!await __decryptPassword(resetPwdDto.oldPwd, resetPwdDto.user.password)) this._Ex("FAILED TO RESET PWD", 400, "AC-76");
      await this.userService.updatePassword(resetPwdDto.user, await __hashPassword(resetPwdDto.newPwd));
      return "PWD UPDATED WITH SUCCESS"
    } catch (error) {
      this._catchEx(error)
    }
  }

  @MessagePattern('RESET_PWD_WITHOUT_CHECK')
  async forgotPwd(@Payload(new ValidationPipe()) forgotPwdDto: ForgotPwdDto):Promise<string> {
    try {
      await this.userService.updatePassword(forgotPwdDto.user, await __hashPassword(forgotPwdDto.newPwd));
      return "PWD UPDATED WITH SUCCESS"
    } catch (error) {
      this._catchEx(error)
    }
  }
}