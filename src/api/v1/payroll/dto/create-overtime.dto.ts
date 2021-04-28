import {IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {OvertimeEnum} from "../enum/overtime.enum";

export class CreateOvertimeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(OvertimeEnum)
  @IsNotEmpty()
  type: OvertimeEnum;

  @IsNotEmpty()
  @IsNumber()
  times: number;

  @IsOptional()
  @IsNumber()
  rate: number;

  @IsOptional()
  @IsString()
  note: string;
}
