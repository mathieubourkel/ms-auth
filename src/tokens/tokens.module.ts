import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensEntity } from './entities/tokens.entity';
import { TokenController } from './token.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TokensEntity])],
  providers: [TokensService],
  controllers: [TokenController],
  exports: [TokensService]
})
export class TokensModule {}
