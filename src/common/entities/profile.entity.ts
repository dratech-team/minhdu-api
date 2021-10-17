import {AppEnum, Branch, Role} from "@prisma/client";

export interface ProfileEntity {
  accountId: number;
  appName: AppEnum;
  username: string;
  branches: Branch[]
  role: Role,
  iat: number,
  exp: number
}
