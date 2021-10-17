import {SetMetadata} from "@nestjs/common";
import {Role, RoleEnum} from "@prisma/client";

export const Roles = (...roles: RoleEnum[]) => {
  return SetMetadata("roles", roles);
};
