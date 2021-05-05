import {SalaryType} from "@prisma/client";
import {IsEnum, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateSalaryDto {

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(SalaryType)
  type: SalaryType;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  note: string;
}
