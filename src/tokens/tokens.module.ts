import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensEntity } from './entities/tokens.entity';
import { TokenController } from './token.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([TokensEntity]), UserModule],
  providers: [TokensService],
  controllers: [TokenController],
  exports: [TokensService]
})
export class TokensModule {}
