import {Role} from "@prisma/client";
import {IsEnum, IsNotEmpty} from "class-validator";

export class ChangeRoleDto {
  @IsNotEmpty()
  @IsEnum(Role)
  readonly role: Role;
}
