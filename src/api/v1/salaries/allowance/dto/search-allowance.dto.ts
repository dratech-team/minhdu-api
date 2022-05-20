import {IsArray, IsDate, IsNumber, IsOptional} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";

export class SearchAllowanceDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly take: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly skip: number;

  @IsOptional()
  @IsNumber({}, {each: true})
  @IsArray()
  @Type(() => Number)
  readonly payrollIds: number[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly payrollId: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Transform((val) => {
    if (val) {
      return new Date(moment(val.value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly startedAt: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Transform((val) => {
    if (val) {
      return new Date(moment(val.value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly endedAt: Date;

}
