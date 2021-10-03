import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateHolidayDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  readonly datetime: Date;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly rate: number;

  @IsNotEmpty({ message: "Chức vụ không được phép để trống" })
  @IsArray()
  readonly positionIds: number[];

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  readonly isConstraint: boolean;
}
