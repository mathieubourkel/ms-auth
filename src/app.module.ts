import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { DataSource } from 'typeorm';
import { GroupModule } from './group/group.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import { DemandModule } from './demand/demand.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: +process.env.MYSQL_TCP_PORT,
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [`${__dirname}/**/entities/*{.js,.ts}`],
      synchronize: process.env.NODE_ENV !== 'production'
    }), 
    UserModule, GroupModule, AuthModule, TokensModule, DemandModule
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}