import {Role} from "@prisma/client";

export interface ProfileEntity {
  accountId: number;
  branchId: number;
  username: string;
  role: Role,
  iat: number,
  exp: number
}
