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
  @Transform((val) => {
    if (val?.value) {
      return new Date(moment(val.value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly createdAt: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Transform((val) => {
    if (val?.value) {
      return new Date(moment(val.value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly deliveredAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Transform((val) => {
    if (val?.value) {
      return new Date(moment(val.value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly endedAt?: Date;

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
  @IsNumber()
  @Type(() => Number)
  readonly provinceId: number;

  @IsOptional()
  @Type(() => Number)
  readonly districtId?: number;

  @IsOptional()
  @Type(() => Number)
  readonly wardId?: number;
}
