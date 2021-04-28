import {IsArray, IsNotEmpty, IsOptional, IsString,} from "class-validator";
import {ObjectId} from "mongodb";

export class CreatePositionDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  @IsArray()
  readonly departmentIds: ObjectId[];
}
