import {IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";
import {DatetimeUnit} from "@prisma/client";
import {DeductionEnum} from "../enums/deduction.enum";

export class CreateDeductionDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly price: number;

  @IsNotEmpty()
  @IsNumber({}, {each: true})
  @Type(() => Number)
  readonly payrollId: number;

  @IsNotEmpty()
  @IsNumber({}, {each: true})
  @Type(() => Number)
  readonly blockId: number;

  @IsOptional()
  @IsEnum(DatetimeUnit)
  readonly unit: DatetimeUnit;

  @IsOptional()
  @IsString()
  readonly note: string;
}
