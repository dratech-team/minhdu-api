import {PartialType} from "@nestjs/mapped-types";
import {CreateOrderDto} from "./create-order.dto";
<<<<<<< HEAD
import {IsBoolean, IsDate, IsNumber, IsOptional} from "class-validator";
=======
import {IsBoolean, IsDate, IsNumber, IsOptional, MaxDate} from "class-validator";
>>>>>>> 05d592b52b6e1e413a3f5140bdc7b3af4eb69ed1
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
<<<<<<< HEAD
  readonly total: number;
=======
  total?: number
>>>>>>> 05d592b52b6e1e413a3f5140bdc7b3af4eb69ed1
}
