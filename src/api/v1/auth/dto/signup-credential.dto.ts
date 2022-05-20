import {SignInCredentialDto} from "./signin-credential.dto";
import {IsArray, IsEnum, IsNumber, IsOptional} from "class-validator";
import {AppEnum} from "@prisma/client";
import {Type} from "class-transformer";

export class SignupCredentialDto extends SignInCredentialDto {
  @IsOptional()
  @Type(() => Number)
  roleId: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, {each: true})
  branchIds: number[];

  @IsOptional()
  @IsEnum(AppEnum)
  appName: AppEnum;
}
