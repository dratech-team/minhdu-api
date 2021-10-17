import {IsNotEmpty} from "class-validator";
import {PartialType} from "@nestjs/mapped-types";
import {SignupCredentialDto} from "./signup-credential.dto";

export class UpdateAuthDto extends PartialType(SignupCredentialDto) {
  @IsNotEmpty()
  readonly roleId: number;
}
