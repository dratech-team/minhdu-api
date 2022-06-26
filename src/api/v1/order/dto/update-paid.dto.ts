import {IsDate, IsEnum, IsNumber, IsOptional} from "class-validator";
import {Transform, Type} from "class-transformer";
import {PaymentType} from "@prisma/client";

export class UpdatePaidDto {
  @IsOptional()
  @Type(() => Date)
  readonly paidAt?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  paidTotal?: number = 0;

  @IsOptional()
  @IsEnum(PaymentType)
  readonly payType?: PaymentType;
}
