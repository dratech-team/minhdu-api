import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsNumber()
  readonly branchId: number;
}
