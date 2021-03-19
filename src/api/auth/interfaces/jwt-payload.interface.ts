import { User } from "../../users/schemas/users.schema";

export interface JwtPayload {
  readonly refreshToken?: string;
  readonly accessToken?: string;
  readonly user: User;
  readonly roleName: string;
}
