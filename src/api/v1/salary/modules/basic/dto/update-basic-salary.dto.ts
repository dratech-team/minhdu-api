import { IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class UpdateBasicSalaryDto {
  @IsString()
  title?: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  amount?: number;
}
