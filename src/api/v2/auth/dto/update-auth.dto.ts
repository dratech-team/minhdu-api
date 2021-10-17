import {Role} from "@prisma/client";
import {IsEnum, IsNotEmpty} from "class-validator";
import {PartialType} from "@nestjs/mapped-types";
import {SignupCredentialDto} from "./signup-credential.dto";

export class UpdateAuthDto extends PartialType(SignupCredentialDto) {
  @IsNotEmpty()
  @IsEnum(Role)
  readonly role: Role;
}
