import {SignInCredentialDto} from "./signin-credential.dto";
import {IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional} from "class-validator";
import {AppEnum, Role} from "@prisma/client";
import {Type} from "class-transformer";

export class SignupCredentialDto extends SignInCredentialDto {
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsEnum(Role)
  role1: Role;

  @IsOptional()
  @IsEnum(Role)
  role2: Role;

  @IsOptional()
  @IsEnum(Role)
  role3: Role;

  @IsOptional()
  @IsEnum(Role)
  role4: Role;

  @IsOptional()
  @IsArray()
  branchIds: number[];

  @IsOptional()
  @IsEnum(AppEnum)
  appName: AppEnum;
}
