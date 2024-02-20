import { Controller } from '@nestjs/common';
import { BaseUtils } from 'libs/base/base.utils';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TokensService } from './tokens.service';

@Controller()
export class TokenController extends BaseUtils {
  constructor(private readonly tokensService: TokensService) {
    super()
  }

  @MessagePattern("GET_EMAIL_TOKEN")
  async getEmailToken(@Payload() searchOption:any) {
    try {
      const result = await this.tokensService.getTokensBySearchOptions(searchOption, [], {id: true, emailToken:true});
        if (!result) this._Ex("NO EMAIL TOKEN", 400, "/TOKEN/CTRL/MS")
        return result;
    } catch (error) {
      this._catchEx(error)
    }
  }

  @MessagePattern("GET_VALIDATION_TOKEN")
  async getValidationToken(@Payload() searchOption:any) {
    try {
      const result = await this.tokensService.getTokensBySearchOptions(searchOption, [], {id: true, validationToken:true});
        if (!result) this._Ex("NO VALIDATION TOKEN", 400, "/TOKEN/CTRL/MS")
        return result;
    } catch (error) {
      this._catchEx(error)
    }
  }



}