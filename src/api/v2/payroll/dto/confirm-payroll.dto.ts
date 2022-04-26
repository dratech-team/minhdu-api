import {Transform, Type} from "class-transformer";
import {IsDate, IsNotEmpty, IsNumber, IsOptional} from "class-validator";
import * as moment from "moment";

export class ConfirmPayrollDto {
  @IsNotEmpty({message: "Vui lòng chọn ngày để xác nhận phiếu lương"})
  @Type(() => Date)
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  @IsDate()
  readonly datetime: Date;
}
