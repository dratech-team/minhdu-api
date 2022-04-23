import {IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";
import {DatetimeUnit} from "@prisma/client";

export class CreateDeductionDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly price: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly payrollId: number;

  @IsOptional()
  @IsEnum(DatetimeUnit)
  readonly unit: DatetimeUnit;

  @IsOptional()
  @IsString()
  readonly note: string;
}
