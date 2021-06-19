import {SignInCredentialDto} from "./signin-credential.dto";
import {IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import { Role } from "@prisma/client";

export class SignupCredentialDto extends SignInCredentialDto {
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;

  @IsOptional()
  @IsNumber()
  employeeId: number;
}
