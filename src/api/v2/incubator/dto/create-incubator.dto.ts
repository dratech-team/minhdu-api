import {IsArray, IsDate, IsNotEmpty, IsNumber, ValidateNested} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";
import {CreateEggDto} from "../../egg/dto/create-egg.dto";

export class CreateIncubatorDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly branchId: number;

  @IsNotEmpty()
  @IsDate()
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly createdAt: Date;
}
