import {IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString, MaxLength} from "class-validator";
import { Type } from "class-transformer";
import {GenderEnum} from "../../core/enum/gender.enum";

export class ICreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly branchCode: string;

  @IsString()
  @IsNotEmpty()
  readonly departmentCode: string;

  @IsNotEmpty()
  readonly positionCode: string;

  @IsNotEmpty()
  readonly  userCode: string;

  @IsNotEmpty()
  @MaxLength(50)
  readonly fullName: string;

  @IsNotEmpty()
  @MaxLength(200)
  readonly address: string;

  @Type(()=>Date)
  @IsNotEmpty()
  readonly dateOfBirth: Date;

  @IsNotEmpty()
  readonly gender: string; //enum

  @IsOptional()
  @MaxLength(11)
  readonly phoneNumber: string;

  @IsOptional()
  @MaxLength(100)
  @IsEmail()
  readonly email: string;

  @IsOptional()
  readonly note: string;
}
