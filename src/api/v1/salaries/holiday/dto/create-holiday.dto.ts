import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateHolidayDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly payrollId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly settingId: number;

  @IsOptional()
  @IsString()
  readonly note: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly blockId: number;
}
