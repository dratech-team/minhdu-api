import {IsEnum, IsNumber, IsOptional} from "class-validator";
import {Transform, Type} from "class-transformer";
import {PaymentType} from "@prisma/client";
import * as moment from "moment";

export class PaymentCustomerDto {
  @IsOptional()
  @Type(() => Date)
  @Transform((val) => new Date(moment(val.value).utc().format('YYYY-MM-DD')))
  readonly paidAt?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly paidTotal?: number;

  @IsOptional()
  @IsEnum(PaymentType)
  readonly payType?: PaymentType;
}
