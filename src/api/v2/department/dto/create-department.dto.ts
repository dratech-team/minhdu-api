import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  color: string;

  @IsNotEmpty()
  @IsString()
  branchId: string;
}
