import {IsDate, IsNotEmpty} from "class-validator";
import {Transform} from "class-transformer";
import * as moment from "moment";

export class RageDatetimeDto {
  @IsNotEmpty()
  @IsDate()
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly startedAt: Date;

  @IsNotEmpty()
  @IsDate()
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly endedAt: Date;
}
