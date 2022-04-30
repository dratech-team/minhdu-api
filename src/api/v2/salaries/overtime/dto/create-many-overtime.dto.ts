import {IsArray, IsDate, IsNotEmpty, IsNumber, IsObject, IsOptional} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";
import {CreateAllowanceDto} from "../../allowance/dto/create-allowance.dto";

export class CreateManyOvertimeDto {
  @IsNotEmpty()
  @IsDate()
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  readonly startedAt: Date;

  @IsNotEmpty()
  @IsDate()
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  readonly endedAt: Date;

  @IsOptional()
  @IsDate()
  @Transform(({value}) => {
    if (value) {
      return new Date(moment(value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly startTime: Date | null;

  @IsOptional()
  @IsDate()
  @Transform(({value}) => {
    if (value) {
      return new Date(moment(value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly endTime: Date | null;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly settingId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly blockId: number;

  @IsNotEmpty()
  @IsNumber({}, {each: true})
  @IsArray()
  @Type(() => Number)
  readonly payrollIds: number[];

  @IsOptional()
  @IsArray()
  @IsObject({each: true})
  readonly allowances: CreateAllowanceDto;

}
