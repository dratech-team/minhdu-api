export interface JwtPayload {
  readonly refreshToken?: string;
  readonly accessToken?: string;
  // readonly user: User;
  readonly roleName: string;
}
