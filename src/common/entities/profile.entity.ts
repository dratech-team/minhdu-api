import {Role} from "@prisma/client";

export interface ProfileEntity {
  accountId: number;
  username: string;
  role: Role,
  iat: number,
  exp: number
}
