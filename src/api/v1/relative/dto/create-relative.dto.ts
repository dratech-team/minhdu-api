import {IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {RelationshipType} from "@prisma/client";
import {Type} from "class-transformer";
import {CreateProfileDto} from "../../../../common/dtos/create-profile.dto";

export class CreateRelativeDto extends CreateProfileDto {
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
  @Type(() => Number)
  @IsNumber()
  readonly employeeId: number;
}
