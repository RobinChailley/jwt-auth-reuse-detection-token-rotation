import { IsString } from 'class-validator';

export class RefreshTokenDTO {
  @IsString()
  refreshToken: string;
}
