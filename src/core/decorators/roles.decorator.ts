import { SetMetadata } from "@nestjs/common";
import { UserType } from "../constants/role-type.constant";

export const Roles = (...roles: UserType[]) => SetMetadata("roles", roles);
