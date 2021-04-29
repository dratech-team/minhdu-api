import {IsArray, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  department: string;

  @IsOptional()
  @IsArray()
  positions: string[];

  @IsOptional()
  @IsArray()
  branchIds: number[];
}
