import { JwtType } from "@/constants/jwt.constant";

export interface CreateTokenPayload {
  tokenId: string;
  refreshTokenId: string;
  roleName: string;
  type: JwtType;
}
