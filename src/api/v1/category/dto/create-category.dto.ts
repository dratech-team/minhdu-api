import {IsArray, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly branchId: number;

  @IsArray()
  @IsOptional()
  readonly employeeIds: number[];
}
