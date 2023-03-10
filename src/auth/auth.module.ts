import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { JwtStrategy } from '@auth/jwt/jwt.strategy';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokensModule } from '@refresh-tokens/refresh-tokens.module';
import { UserEntity } from '@users/entities/user.entity';
import { UsersModule } from '@users/users.module';

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    RefreshTokensModule,
    TypeOrmModule.forFeature([UserEntity]),
    UsersModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
