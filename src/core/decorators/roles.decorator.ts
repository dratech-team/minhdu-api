import { SetMetadata } from "@nestjs/common";
import { USER_TYPE } from "../constants/role-type.constant";

export const Roles = (...roles: USER_TYPE[]) => SetMetadata("roles", roles);
