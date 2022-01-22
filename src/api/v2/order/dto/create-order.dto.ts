import {CurrencyUnit} from "@prisma/client";
import {Transform, Type} from "class-transformer";
import {IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import * as moment from "moment";

export class CreateOrderDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly customerId?: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  readonly createdAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Transform((val) => new Date(moment(val.value).format('YYYY-MM-DD')))
  readonly deliveredAt: Date;

  @IsOptional()
  @IsString()
  readonly explain?: string;

  @IsOptional()
  @IsEnum(CurrencyUnit)
  readonly currency?: CurrencyUnit;

  @IsOptional()
  @IsArray()
  readonly commodityIds?: number[];

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly wardId?: number;
}
