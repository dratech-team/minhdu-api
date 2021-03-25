import { SetMetadata } from "@nestjs/common";
import { USER_TYPE } from "../constant/role-type.constant";

export const Roles = (...roles: USER_TYPE[]) => SetMetadata("roles", roles);
