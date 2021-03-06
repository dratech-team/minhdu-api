import {AppEnum, Branch, Role, RoleEnum} from "@prisma/client";

export interface ProfileEntity {
  id: number;
  appName: AppEnum;
  username: string;
  managedBy: RoleEnum;
  branches: Branch[]
  role: RoleEnum,
  iat: number,
  exp: number
}
