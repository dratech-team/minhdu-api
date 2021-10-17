import {SignInCredentialDto} from "./signin-credential.dto";
import {IsArray, IsEnum, IsNotEmpty, IsOptional} from "class-validator";
import {AppEnum} from "@prisma/client";
import {Type} from "class-transformer";

export class SignupCredentialDto extends SignInCredentialDto {
  @IsOptional()
  @Type(() => Number)
  roleId: number;

  @IsOptional()
  @IsArray()
  branchIds: number[];

  @IsOptional()
  @IsEnum(AppEnum)
  appName: AppEnum;
}
