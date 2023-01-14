import { Module } from '@nestjs/common';
import { UsersController } from '@users/users.controller';
import { UsersService } from '@users/users.service';

@Module({
  controllers: [UsersController],
  exports: [],
  providers: [UsersService],
})
export class UsersModule {}
