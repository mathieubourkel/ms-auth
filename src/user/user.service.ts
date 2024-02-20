import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseUtils } from 'libs/base/base.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { RejoinGroupDto } from './dto/rejoin-group.dto';
import { UserStatusEnum } from 'enums/user.status.enum';

@Injectable()
export class UserService extends BaseUtils {
  
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {
    super()
}

  async findAll(relations?: Array<string>, select?:any) {
    try {
      return await this.userRepository.find({ relations, select })
    } catch (error) {
      this._catchEx(error)
    }
  }

  async getOneById(id: number, relations?: Array<string>, select?:any) {
    try {
      return await this.userRepository.findOne({ where:{id}, relations, select })
    } catch (error) {
      this._catchEx(error)
    }
  }

  async create(createUserDto: CreateUserDto){
    try {
      return await this.userRepository.save(createUserDto)
    } catch (error) {
      this._catchEx(error)
    }
  }

  async getOneBySearchOptions(searchOptions:{}, relations?: Array<string>, select?:any) {
    try {
      return await this.userRepository.findOne({ where:searchOptions, relations, select })
    } catch (error) {
      this._catchEx(error)
    }
  }

  async update(user: UserEntity, updateUserDto: UpdateUserDto) {
    try {
      return this.userRepository.save(this.userRepository.merge(user, updateUserDto))
    } catch (error) {
      this._catchEx(error)
    }
  }

  async updatePassword(user: UserEntity, updatePassword: string) {
    try {
      return this.userRepository.save(this.userRepository.merge(user, {password: updatePassword, status: UserStatusEnum.ACTIVE}))
    } catch (error) {
      this._catchEx(error)
    }
  }

  async updateStatusUser(user: UserEntity, status: number) {
    try {
      return this.userRepository.save(this.userRepository.merge(user, {status: status}))
    } catch (error) {
      this._catchEx(error)
    }
  }

  async updateCountUser(user: UserEntity, resetCount?: boolean) {
    try {
      if (resetCount) user.count = 0
      return await this.userRepository.save(this.userRepository.merge(user, {count: user.count +1}))
    } catch (error) {
      this._catchEx(error)
    }
  }

  async addGroup(user: UserEntity, rejoinGroupDto: RejoinGroupDto) {
    try {
      return this.userRepository.save(this.userRepository.merge(user, rejoinGroupDto))
    } catch (error) {
      this._catchEx(error)
    }
  }

  async delete(id: number) {
    try {
      return await this.userRepository.delete(id)
    } catch (error) {
      this._catchEx(error)
    }
  }
}
