import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  color: string;

  @IsNotEmpty()
  @IsNumber()
  branchId: number;
}
