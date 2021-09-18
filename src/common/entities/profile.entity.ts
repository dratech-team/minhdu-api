import {AppEnum, Role} from "@prisma/client";

export interface ProfileEntity {
  accountId: number;
  branchId: number;
  appName: AppEnum;
  username: string;
  role: Role,
  iat: number,
  exp: number
}
