import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  color: string;

  @IsNotEmpty()
  @IsArray()
  branchIds: string[];
}
