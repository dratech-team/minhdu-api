import {PartialType} from "@nestjs/mapped-types";
import {CreateOrderDto} from "./create-order.dto";
import {IsBoolean, IsDate, IsNumber, IsOptional, MaxDate} from "class-validator";
import {Type} from "class-transformer";

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @Type(() => Date)
  @MaxDate(new Date(), {message: `Ngày tối đa được chọn là ngày hôm nay. Đơn hàng đã giao không phải là ngày của tương lai`})
  @IsDate()
  readonly deliveredAt: Date;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  readonly hide: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  total?: number
}
