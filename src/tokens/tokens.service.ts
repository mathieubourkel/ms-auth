import { Injectable } from '@nestjs/common';
import { BaseUtils } from 'libs/base/base.utils';
import { TokensEntity } from './entities/tokens.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TokensService extends BaseUtils {

  constructor(@InjectRepository(TokensEntity) private tokensRepository: Repository<TokensEntity>) {
    super()
}

async create(tokens: any){
  try {
    return await this.tokensRepository.save(tokens)
  } catch (error) {
    this._catchEx(error)
  }
}

async getTokensBySearchOptions(searchOptions:{}, relations?: Array<string>, select?:any) {
  try {
    return await this.tokensRepository.findOne({ where:searchOptions, relations, select })
  } catch (error) {
    this._catchEx(error)
  }
}

async update(tokens:any, newTokens:{}, relations?: Array<string>, select?:any) {
  try {
    return this.tokensRepository.save(this.tokensRepository.merge(tokens, newTokens))
  } catch (error) {
    this._catchEx(error)
  }
}

async delete(id: number) {
  try {
    return await this.tokensRepository.delete(id)
  } catch (error) {
    this._catchEx(error)
  }
}

}
