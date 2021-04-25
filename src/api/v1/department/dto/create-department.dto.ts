import {IsArray, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {ObjectId} from "mongodb";

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  readonly department: string;

  @IsArray()
  @IsOptional()
  readonly branchIds: ObjectId[];
}
