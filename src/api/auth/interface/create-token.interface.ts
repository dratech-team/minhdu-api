import { JwtType } from "@/constants";

export interface CreateTokenPayload {
  tokenId: string;
  refreshTokenId: string;
  roleName: string;
  type: JwtType;
}
