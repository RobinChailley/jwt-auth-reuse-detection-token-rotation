import { AuthService } from '@auth/auth.service';
import { RefreshTokenDTO } from '@auth/dto/refresh-token.dto';
import { SignInDTO } from '@auth/dto/signin.dto';
import { TokensDTO } from '@auth/dto/tokens.dto';
import { Body, Controller, Delete, Logger, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signin(@Body() signInDTO: SignInDTO): Promise<TokensDTO> {
    this.logger.log('/signin');
    return this.authService.signin(signInDTO);
  }

  @Post('/signup')
  async signup(@Body() signInDTO: SignInDTO): Promise<TokensDTO> {
    this.logger.log('/signup');
    return this.authService.signup(signInDTO);
  }

  @Post('/refresh')
  async refresh(@Body() refreshTokenDTO: RefreshTokenDTO): Promise<TokensDTO> {
    this.logger.log('/refresh');
    return this.authService.refresh(refreshTokenDTO);
  }

  @Delete('/logout')
  async logout(@Body() refreshTokenDTO: RefreshTokenDTO): Promise<void> {
    this.logger.log('/logout');
    return this.authService.logout(refreshTokenDTO);
  }
}
