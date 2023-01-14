import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from '@refresh-tokens/entities/refresh-token.entity';
import { RefreshTokensService } from '@refresh-tokens/refresh-tokens.service';

@Module({
  exports: [RefreshTokensService],
  imports: [TypeOrmModule.forFeature([RefreshTokenEntity])],
  providers: [RefreshTokensService],
})
export class RefreshTokensModule {}
