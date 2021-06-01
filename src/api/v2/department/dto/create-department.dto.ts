import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  color: string = Math.floor(Math.random() * 16777215).toString(16);

  @IsNotEmpty()
  @IsNumber()
  branchId: number;
}
