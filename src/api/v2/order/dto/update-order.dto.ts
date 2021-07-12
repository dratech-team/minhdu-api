import {PartialType} from "@nestjs/mapped-types";
import {PaymentType} from "@prisma/client";
import {Transform, Type} from "class-transformer";
import {IsEnum, IsNumber, IsOptional} from "class-validator";
import {CreateOrderDto} from "./create-order.dto";

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @Type(() => Date)
  @Transform((val) => new Date(val.value))
  paidAt?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly paidTotal?: number;

  @IsOptional()
  @IsEnum(PaymentType)
  readonly payType?: PaymentType;
}
