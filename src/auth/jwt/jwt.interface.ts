export interface JwtPayload {
  email: string;
}

export interface AccessToken {
  accessToken: string;
  refreshToken: string;
}
