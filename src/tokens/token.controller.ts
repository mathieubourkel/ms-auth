import { Controller } from '@nestjs/common';
import { BaseUtils } from 'libs/base/base.utils';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TokensService } from './tokens.service';
import { UserService } from 'src/user/user.service';
import { __createEmailToken } from './tokens.utils';

@Controller()
export class TokenController extends BaseUtils {
  constructor(private readonly tokensService: TokensService,
    private readonly userService: UserService) {
    super()
  }

  @MessagePattern("GET_EMAIL_TOKEN")
  async getEmailToken(@Payload() searchOption:{}) {
    try {
      return await this.tokensService.getTokensBySearchOptions(searchOption, [], {id: true, emailToken:true});
    } catch (error) {
      this._catchEx(error)
    }
  }

  @MessagePattern("GET_VALIDATION_TOKEN")
  async getValidationToken(@Payload() searchOption:{}) {
    try {
      return await this.tokensService.getTokensBySearchOptions(searchOption, [], {id: true, validationToken:true});
    } catch (error) {
      this._catchEx(error)
    }
  }

  @MessagePattern("CREATE_EMAIL_TOKEN")
  async getOneUserWithEmailToken(@Payload('email') email:string) {
    try {
      const user = await this.userService.getOneBySearchOptions({email: email}, [], {id: true, password: true, email: true});
      if (!user) this._Ex("MAIL SEND", 200, "CTRL/RST/PWD")
      const tokens:any = await this.tokensService.getTokensBySearchOptions({user:{id: user.id}})
      const result:any = await this.tokensService.update(tokens, {emailToken: await __createEmailToken(user.id, user.email)})
      return {emailToken:result.emailToken}
    } catch (error) {
      this._catchEx(error)
    }
  }
}