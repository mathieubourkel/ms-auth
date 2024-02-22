import { Injectable } from '@nestjs/common';
import { BaseUtils } from 'libs/base/base.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DemandEntity } from './entities/demand.entity';
import { CreateDemandDto } from './dto/create-demand.dto';

@Injectable()
export class DemandService extends BaseUtils {

  constructor(@InjectRepository(DemandEntity) private demandRepository: Repository<DemandEntity>) {
    super()
}

async getOneById(id: number, relations?: Array<string>, select?:{}):Promise<DemandEntity> {
  try {
    return await this.demandRepository.findOne({ where:{id}, relations, select })
  } catch (error) {
    this._catchEx(error)
  }
}

async getOneBySearchOption(searchOption: {}, relations?: Array<string>, select?:{}):Promise<DemandEntity> {
  try {
    return await this.demandRepository.findOne({ where:searchOption, relations, select })
  } catch (error) {
    this._catchEx(error)
  }
}

async getManyBySearchOption(searchOption: {}, relations?: Array<string>, select?:{}):Promise<DemandEntity[]> {
  try {
    return await this.demandRepository.find({ where:searchOption, relations, select })
  } catch (error) {
    this._catchEx(error)
  }
}

async create(data:CreateDemandDto):Promise<DemandEntity>{
  try {
    return await this.demandRepository.save(data)
  } catch (error) {
    this._catchEx(error)
  }
}

async update(demand: DemandEntity, data:{status:number}):Promise<DemandEntity> {
  try {
    return this.demandRepository.save(this.demandRepository.merge(demand, data))
  } catch (error) {
    this._catchEx(error)
  }
}

async delete(id: number):Promise<unknown> {
  try {
    return await this.demandRepository.delete(id)
  } catch (error) {
    this._catchEx(error)
  }
}

}
