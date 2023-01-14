import { RefreshTokenDTO } from '@auth/dto/refresh-token.dto';
import { SignInDTO } from '@auth/dto/signin.dto';
import { TokensDTO } from '@auth/dto/tokens.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokensService } from '@refresh-tokens/refresh-tokens.service';
import { UserEntity } from '@users/entities/user.entity';
import { UsersService } from '@users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshTokensService: RefreshTokensService,
  ) {}

  async signin(signInDto: SignInDTO): Promise<TokensDTO> {
    const { email, password } = signInDto;
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashPassword);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    return this.generateTokensAndSave(user);
  }

  async signup(signInDTO: SignInDTO): Promise<TokensDTO> {
    const { password, email } = signInDTO;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const user = this.usersService.create({
      email,
      hashPassword,
      salt,
    });

    await this.usersService.save(user);

    return this.generateTokensAndSave(user);
  }

  async refresh(refreshToken: RefreshTokenDTO): Promise<TokensDTO> {
    const { id } = this.jwtService.verify(refreshToken.refreshToken);
    const user = await this.usersService.findOneById(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    const refreshTokenEntity = await this.refreshTokensService.findOne(
      refreshToken.refreshToken,
      user,
    );

    if (!refreshTokenEntity) {
      this.refreshTokensService.deleteAllOfUser(user);
      throw new UnauthorizedException();
    }

    this.refreshTokensService.deleteOne(refreshTokenEntity);

    return this.generateTokensAndSave(user);
  }

  private generateToken(user: UserEntity, expiresIn: string): string {
    return this.jwtService.sign({ id: user.id }, { expiresIn });
  }

  private generateTokensAndSave(user: UserEntity): TokensDTO {
    const accessToken = this.generateToken(user, '5min');
    const refreshToken = this.generateToken(user, '365d');

    this.refreshTokensService.createAndSave(user, refreshToken);

    return { accessToken, refreshToken };
  }
}
