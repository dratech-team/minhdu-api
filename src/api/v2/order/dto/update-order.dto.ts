import {PartialType} from "@nestjs/mapped-types";
import {CreateOrderDto} from "./create-order.dto";
import {IsDate, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly deliveredAt: Date;
}
