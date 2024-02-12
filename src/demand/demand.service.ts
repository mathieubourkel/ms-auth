import { Injectable } from '@nestjs/common';
import { BaseUtils } from 'libs/base/base.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DemandEntity } from './entities/demand.entity';
import { CreateDemandDto } from './dto/create-demand.dto';
import { UpdateDemandDto } from './dto/update-demand.dto';

@Injectable()
export class DemandService extends BaseUtils {

  constructor(@InjectRepository(DemandEntity) private demandRepository: Repository<DemandEntity>) {
    super()
}

async getOneById(id: number, relations?: Array<string>, select?:any) {
  try {
    return await this.demandRepository.findOne({ where:{id}, relations, select })
  } catch (error) {
    this._catchEx(error)
  }
}

async create(createDemandDto: CreateDemandDto){
  try {
    return await this.demandRepository.save(createDemandDto)
  } catch (error) {
    this._catchEx(error)
  }
}

async update(demand: DemandEntity, updateDemandDto: UpdateDemandDto) {
  try {
    return this.demandRepository.save(this.demandRepository.merge(demand, updateDemandDto))
  } catch (error) {
    this._catchEx(error)
  }
}

async delete(id: number) {
  try {
    return await this.demandRepository.delete(id)
  } catch (error) {
    this._catchEx(error)
  }
}

}
