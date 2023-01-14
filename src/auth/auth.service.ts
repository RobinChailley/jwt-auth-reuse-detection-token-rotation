import { SignInDTO } from '@auth/dto/signin.dto';
import { TokensDTO } from '@auth/dto/tokens.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '@users/entities/user.entity';
import { UsersService } from '@users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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

    return this.generateTokens(user);
  }

  async signup(signInDTO: SignInDTO): Promise<TokensDTO> {
    const { password, email } = signInDTO;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const user = this.usersService.createUser({
      email,
      hashPassword,
      salt,
    });

    await this.usersService.saveUser(user);

    return this.generateTokens(user);
  }

  private async generateTokens(user: UserEntity): Promise<TokensDTO> {
    return {
      accessToken: this.jwtService.sign({ id: user.id }, { expiresIn: '5min' }),
      refreshToken: this.jwtService.sign(
        { id: user.id },
        { expiresIn: '365d' },
      ),
    };
  }
}
