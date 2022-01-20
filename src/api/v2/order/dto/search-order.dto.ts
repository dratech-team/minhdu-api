import {PaidEnum} from "../enums/paid.enum";
import {Customer, PaymentType} from "@prisma/client";
import {IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";

export class SearchOrderDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly skip: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly take: number;

  @IsOptional()
  @Transform((val) => new Date(val.value))
  readonly createdAt: Date;

  @IsOptional()
  @Transform((val) => new Date(val.value))
  readonly deliveredAt: Date;

  @IsOptional()
  @IsString()
  readonly commodity: string;

  @IsOptional()
  readonly paidType: PaidEnum;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly customerId: Customer["id"];

  @IsOptional()
  @IsString()
  readonly customer: string;

  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsEnum(PaymentType)
  readonly payType: PaymentType;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly status: 0 | 1;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  readonly hide: boolean;
}
