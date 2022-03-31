import {IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString,} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";

export class CreateHolidayDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsNotEmpty()
  @Type(() => Date)
  @Transform((val) => new Date(moment(val.value).utc().format('YYYY-MM-DD')))
  @IsDate()
  readonly datetime: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly rate: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly price: number;

  @IsNotEmpty({message: "Chức vụ không được phép để trống"})
  @IsArray()
  readonly positionIds: number[];

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  readonly isConstraint: boolean;
}
