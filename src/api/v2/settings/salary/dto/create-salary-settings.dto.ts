import {DatetimeUnit, SalaryType} from "@prisma/client";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validate
} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";

export class CreateSalarySettingsDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsEnum(SalaryType)
  readonly type: SalaryType;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly rate: number;

  @IsOptional()
  @IsNumber({}, {each: true})
  @IsArray()
  @Type(() => Number)
  readonly prices: number[];

  @IsOptional()
  @IsArray()
  @IsEnum(SalaryType, {each: true})
  @Transform(({value}) => {
    if (value === null) {
      return undefined;
    }
    return value;
  })
  readonly totalOf: SalaryType[];

  @IsNotEmpty({message: "Bạn phải chọn buổi", groups: ["absent", "overtime"]})
  @IsEnum(DatetimeUnit, {groups: ["absent", "overtime"]})
  readonly unit: DatetimeUnit;

  @IsOptional({groups: ["holiday"]})
  @IsDate()
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  readonly startedAt: Date;

  @IsOptional({groups: ["holiday"]})
  @IsDate()
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  readonly endedAt: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly workday: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  readonly hasConstraints: boolean;
}
