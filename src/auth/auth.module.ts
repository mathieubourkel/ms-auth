import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GroupService } from 'src/group/group.service';
import { TokensService } from 'src/tokens/tokens.service';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { TokensEntity } from 'src/tokens/entities/tokens.entity';
import { GroupEntity } from 'src/group/entities/group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TokensEntity, GroupEntity])],
  controllers: [AuthController],
  providers: [UserService, TokensService, GroupService]
})
export class AuthModule {}
