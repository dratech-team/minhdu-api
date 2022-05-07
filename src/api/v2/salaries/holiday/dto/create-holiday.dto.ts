import {IsDate, IsNotEmpty, IsNumber} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";

export class CreateHolidayDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly payrollId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly settingId: number;

  @IsNotEmpty()
  @IsDate()
  @Transform(({value}) => {
    return new Date(moment(value).set({hours: 0, minutes: 0, seconds: 0}).format('YYYY-MM-DD'));
  })
  readonly datetime: Date;
}
