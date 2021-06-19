import {RelationshipType} from "@prisma/client";
import {IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from "class-validator";
import {CreateProfileDto} from "../../profile/dto/create-profile.dto";

export class CreateRelativeDto {
  @IsNotEmpty()
  @IsEnum(RelationshipType)
  readonly relationship: RelationshipType;

  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly career: string;

  @IsNotEmpty()
  @IsNumber()
  readonly employeeId: number;

  @IsNotEmpty()
  @ValidateNested()
  readonly profile: CreateProfileDto;
}
