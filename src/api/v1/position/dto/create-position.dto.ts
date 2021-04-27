import {IsArray, IsNotEmpty, IsNumber, IsOptional, IsString,} from "class-validator";
import {Type} from "class-transformer";
import {ObjectId} from "mongodb";

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly workDay: number;

  @IsOptional()
  @IsArray()
  readonly departmentIds: ObjectId[];
}
