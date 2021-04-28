import {IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {DeductionEnum} from "../enum/deduction.enum";

export class CreateDeductionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(DeductionEnum)
  @IsNotEmpty()
  type: DeductionEnum;

  @IsNotEmpty()
  @IsNumber()
  times: number;

  @IsOptional()
  @IsString()
  note: string;
}
