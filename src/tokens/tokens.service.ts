import { Injectable } from '@nestjs/common';
import { BaseUtils } from 'libs/base/base.utils';
import { TokensEntity } from './entities/tokens.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTokensDto } from './dto/create-tokens.dto';
import { UpdateTokensDto } from './dto/update-tokens.dto';

@Injectable()
export class TokensService extends BaseUtils {

  constructor(@InjectRepository(TokensEntity) private tokensRepository: Repository<TokensEntity>) {
    super()
}

async create(data: CreateTokensDto):Promise<TokensEntity>{
  try {
    return await this.tokensRepository.save(data)
  } catch (error) {
    this._catchEx(error)
  }
}

async getTokensBySearchOptions(searchOptions:{}, relations?: Array<string>, select?:{}):Promise<TokensEntity> {
  try {
    return await this.tokensRepository.findOne({ where:searchOptions, relations, select })
  } catch (error) {
    this._catchEx(error)
  }
}

async update(tokens:TokensEntity, newTokens:UpdateTokensDto):Promise<TokensEntity> {
  try {
    return this.tokensRepository.save(this.tokensRepository.merge(tokens, newTokens))
  } catch (error) {
    this._catchEx(error)
  }
}

async delete(id: number):Promise<unknown> {
  try {
    return await this.tokensRepository.delete(id)
  } catch (error) {
    this._catchEx(error)
  }
}

}
