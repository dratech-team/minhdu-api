import {SignInCredentialDto} from "./signin-credential.dto";
import {IsEnum, IsNotEmpty, IsNumber, IsOptional} from "class-validator";
import {AppEnum, Role} from "@prisma/client";
import {Type} from "class-transformer";

export class SignupCredentialDto extends SignInCredentialDto {
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  branchId: number;

  @IsOptional()
  @IsEnum(AppEnum)
  appName: AppEnum;
}
