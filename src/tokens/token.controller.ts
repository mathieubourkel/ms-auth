import { Controller } from '@nestjs/common';
import { BaseUtils } from 'libs/base/base.utils';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TokensService } from './tokens.service';
import { UserService } from 'src/user/user.service';
import { __createEmailToken } from './tokens.utils';
import { TokensEntity } from './entities/tokens.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Controller()
export class TokenController extends BaseUtils {
  constructor(private readonly tokensService: TokensService,
    private readonly userService: UserService) {
    super()
  }

  @MessagePattern("GET_EMAIL_TOKEN")
  async getEmailToken(@Payload() searchOption:{emailToken:string}):Promise<TokensEntity> {
    try {
      return await this.tokensService.getTokensBySearchOptions(searchOption, [], {id: true, emailToken:true});
    } catch (error) {
      this._catchEx(error)
    }
  }

  @MessagePattern("GET_VALIDATION_TOKEN")
  async getValidationToken(@Payload() searchOption:{validationToken:string}):Promise<TokensEntity> {
    try {
      return await this.tokensService.getTokensBySearchOptions(searchOption, [], {id: true, validationToken:true});
    } catch (error) {
      this._catchEx(error)
    }
  }

  @MessagePattern("CREATE_EMAIL_TOKEN")
  async getOneUserWithEmailToken(@Payload('email') email:string):Promise<{emailToken:string}> {
    try {
      const user:UserEntity = await this.userService.getOneBySearchOptions({email: email}, [], {id: true, password: true, email: true});
      if (!user) this._Ex("MAIL SEND", 200, "CTRL/RST/PWD")
      const tokens:TokensEntity = await this.tokensService.getTokensBySearchOptions({user:{id: user.id}})
      const result:TokensEntity = await this.tokensService.update(tokens, {emailToken: __createEmailToken(user.id, user.email)})
      return {emailToken:result.emailToken}
    } catch (error) {
      this._catchEx(error)
    }
  }
}