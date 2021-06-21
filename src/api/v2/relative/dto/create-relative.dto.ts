import {IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from "class-validator";
import {RelationshipType} from "@prisma/client";
import {Type} from "class-transformer";
import {CreateProfileDto} from "../../employee/dto/create-profile.dto";

export class CreateRelativeDto {
  @IsNotEmpty()
  @IsEnum(RelationshipType)
  readonly relationship: RelationshipType;

  @IsOptional()
  @IsString()
  readonly career: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  readonly sos: boolean;

  @IsNotEmpty()
  @ValidateNested()
  readonly profile: CreateProfileDto;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  employeeId: number;
}
