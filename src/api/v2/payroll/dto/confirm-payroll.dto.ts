import {Transform, Type} from "class-transformer";
import {IsDate, IsNotEmpty, IsNumber, IsOptional} from "class-validator";

export class ConfirmPayrollDto {
  @IsNotEmpty({message: "Vui lòng chọn ngày để xác nhận phiếu lương"})
  @Type(() => Date)
  @IsDate()
  readonly datetime: Date;
}
