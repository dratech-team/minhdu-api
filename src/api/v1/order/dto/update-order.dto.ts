import {PartialType} from "@nestjs/mapped-types";
import {CreateOrderDto} from "./create-order.dto";
import {IsBoolean, IsNumber, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  readonly hide: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly total: number;
}
