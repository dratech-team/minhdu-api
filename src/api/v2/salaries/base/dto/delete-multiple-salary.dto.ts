import {IsArray, IsNotEmpty, IsNumber} from "class-validator";
import {Type} from "class-transformer";

export class DeleteMultipleSalaryDto {
  @IsNotEmpty()
  @IsNumber({}, {each: true})
  @Type(() => Number)
  @IsArray()
  readonly salaryIds: number[]
}
