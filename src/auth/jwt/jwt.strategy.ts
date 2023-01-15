import { JwtPayload } from '@auth/jwt/jwt.interface';
import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserEntity } from '@users/entities/user.entity';
import { UsersService } from '@users/users.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const { id } = payload;

    if (!id) {
      throw new UnauthorizedException();
    }

    return await this.userService.findOneByIdOrThrow(id);
  }
}
