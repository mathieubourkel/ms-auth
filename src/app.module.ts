import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { DataSource } from 'typeorm';
import { GroupModule } from './group/group.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import { DemandModule } from './demand/demand.module';
import { UserEntity } from './user/entities/user.entity';
import { GroupEntity } from './group/entities/group.entity';
import { TokensEntity } from './tokens/entities/tokens.entity';
import { DemandEntity } from './demand/entities/demand.entity';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: +process.env.MYSQL_TCP_PORT,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [UserEntity, GroupEntity, TokensEntity, DemandEntity],
      synchronize: true
    }), 
    UserModule, GroupModule, AuthModule, TokensModule, DemandModule
  ]
})

export class AppModule {}