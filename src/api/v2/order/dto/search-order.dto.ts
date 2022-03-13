import {PaidEnum} from "../enums/paid.enum";
import {Customer, PaymentType} from "@prisma/client";
import {IsBoolean, IsEnum, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";

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
  @Transform((val) => {
    if (val.value) {
      return new Date(moment(val.value).format('YYYY-MM-DD'));
    }
  })
  readonly createStartedAt: Date;

  @IsOptional()
  @Transform((val) => {
    if (val.value) {
      return new Date(moment(val.value).format('YYYY-MM-DD'));
    }
  })
  readonly createEndedAt: Date;

  @IsOptional()
  @Transform((val) => {
    if (val.value) {
      return new Date(moment(val.value).format('YYYY-MM-DD'));
    }
  })
  readonly deliveryStartedAt: Date;

  @IsOptional()
  @Transform((val) => {
    if (val.value) {
      return new Date(moment(val.value).format('YYYY-MM-DD'));
    }
  })
  readonly deliveryEndedAt: Date;

  @IsOptional()
  @Transform((val) => {
    if (val.value) {
      return new Date(moment(val.value).format('YYYY-MM-DD'));
    }
  })
  readonly startedAt: Date;

  @IsOptional()
  @Transform((val) => {
    if (val.value) {
      return new Date(moment(val.value).format('YYYY-MM-DD'));
    }
  })
  readonly endedAt: Date;

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
  @IsString()
  readonly province: string;

  @IsOptional()
  @IsEnum(PaymentType)
  readonly payType: PaymentType;

  @IsOptional()
  @IsNumber()
  @Type((v) => Number)
  readonly status: 0 | 1;

  @IsOptional()
  readonly hide: string;


  @IsOptional()
  readonly filterRoute: string;
}
