import {IsEnum, IsNotEmpty, IsString} from "class-validator";
import {RoleEnum} from "@prisma/client";

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEnum(RoleEnum)
  readonly role: RoleEnum;

}
