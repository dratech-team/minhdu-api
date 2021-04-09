// import { JwtType } from "@/core/constants/jwt.constant";

import { JwtType } from "../../../../core/constants/jwt.constant";

export interface CreateTokenPayload {
  tokenId: string;
  refreshTokenId: string;
  roleName: string;
  type: JwtType;
}
