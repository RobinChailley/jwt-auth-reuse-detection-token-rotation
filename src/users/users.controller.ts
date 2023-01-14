import { GetUser } from '@auth/decorators/get-user.decorator';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '@users/entities/user.entity';

@Controller('users')
export class UsersController {
  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async getMe(@GetUser() user: UserEntity): Promise<UserEntity> {
    return user;
  }
}
