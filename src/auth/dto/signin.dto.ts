import { IsEmail, IsStrongPassword } from 'class-validator';

export class SignInDTO {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;
}
