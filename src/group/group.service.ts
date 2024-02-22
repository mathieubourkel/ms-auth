import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { BaseUtils } from 'libs/base/base.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from './entities/group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupService extends BaseUtils {

  constructor(@InjectRepository(GroupEntity) private groupRepository: Repository<GroupEntity>) {
    super()
}

  async create(createGroupDto: CreateGroupDto):Promise<GroupEntity> {
    try {
      return await this.groupRepository.save(createGroupDto)
    } catch (error) {
      this._catchEx(error)
    }
  }

  async getOneById(id: number, relations?: Array<string>, select?:{}):Promise<GroupEntity> {
    try {
      return await this.groupRepository.findOne({ where:{id}, relations, select })
    } catch (error) {
      this._catchEx(error)
    }
  }

  async findAll(relations?: Array<string>):Promise<GroupEntity[]> {
    try {
      return await this.groupRepository.find({ relations })
    } catch (error) {
      this._catchEx(error)
    }
  }
  
  async update(id: number, updateGroupDto: UpdateGroupDto,  relations?: Array<string>, select?:{}):Promise<GroupEntity> {
    try {
      const result = await this.groupRepository.findOne({ where: { id } , relations, select})
      return this.groupRepository.save(this.groupRepository.merge(result, updateGroupDto))
    } catch (error) {
      this._catchEx(error)
    }
  }

  async delete(id: number):Promise<unknown> {
    try {
      return await this.groupRepository.delete(id)
    } catch (error) {
      this._catchEx(error)
    }
  }
}

