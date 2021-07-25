import {CurrencyUnit, PaymentType} from "@prisma/client";
import {IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min} from "class-validator";
import {Type} from "class-transformer";

export class CreatePaymentHistoryDto {

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly paidAt: Date;

  @IsOptional()
  @IsEnum(CurrencyUnit)
  readonly currency: CurrencyUnit;

  @IsOptional()
  @IsEnum(PaymentType)
  readonly payType: PaymentType;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(10000, {message: 'Thanh toán ít nhất 10k. OK'})
  readonly total: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly orderId: number;

  @IsOptional()
  @IsString()
  readonly note?: string;

}
