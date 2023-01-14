import { AuthService } from '@auth/auth.service';
import { SignInDTO } from '@auth/dto/signin.dto';
import { TokensDTO } from '@auth/dto/tokens.dto';
import { Body, Controller, Logger, Post } from '@nestjs/common';

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
}
