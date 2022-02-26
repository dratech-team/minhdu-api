import {SearchBaseDto} from "../../../../common/dtos/search-base.dto";
import {IsDate, IsNotEmpty, IsNumber, IsOptional} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";

export class SearchIncubatorDto extends SearchBaseDto {
  @IsNotEmpty()
  @IsDate()
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly startedAt: Date;

  @IsNotEmpty()
  @IsDate()
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly endedAt: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly branchId: number;
}
