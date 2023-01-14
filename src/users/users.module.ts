import { Module } from '@nestjs/common';
import { UsersService } from '@users/users.service';
import { UsersController } from '@users/users.controller';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  exports: []
})
export class UsersModule {}
