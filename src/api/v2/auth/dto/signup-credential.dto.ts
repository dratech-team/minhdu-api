import {SignInCredentialDto} from "./signin-credential.dto";
import {IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Role} from "@prisma/client";
import {UserType} from "../../../../core/constants/role-type.constant";

export class SignupCredentialDto extends SignInCredentialDto {
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  @IsOptional()
  employeeId: string;

  @IsOptional()
  @IsString()
  branchId: string;
}
