import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [AuthController],
  exports: [],
  providers: [AuthService],
})
export class AuthModule {}
