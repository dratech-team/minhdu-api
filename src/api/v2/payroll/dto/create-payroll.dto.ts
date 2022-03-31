import {IsDate, IsNotEmpty, IsNumber, IsOptional,} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";

export class CreatePayrollDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly employeeId?: number;

  @IsNotEmpty()
  @Type(() => Date)
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  @IsDate()
  readonly createdAt: Date;
}
