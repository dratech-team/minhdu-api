import {CreateCommodityDto} from './create-commodity.dto';
import {PartialType} from "@nestjs/mapped-types";
import {IsBoolean, IsDate, IsOptional} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";

export class UpdateCommodityDto extends PartialType(CreateCommodityDto) {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  readonly logged?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Transform((val) => {
    if (val?.value) {
      return new Date(moment(val.value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly deliveredAt?: Date;
}
