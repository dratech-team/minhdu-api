import { IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

export class ISalaryDto {
  @IsString()
  title: string;

  @Type(() => Number)
  @IsNumber()
  amount: number;
}
