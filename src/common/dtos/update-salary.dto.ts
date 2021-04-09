import { IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class IUpdateSalaryDto {
  @IsString()
  @IsOptional()
  title: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  note: string;
}
