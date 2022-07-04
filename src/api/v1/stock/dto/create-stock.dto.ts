import {DiscountType, StockType} from "@prisma/client";
import {IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Transform, Type} from "class-transformer";
import * as moment from "moment";

export class CreateStockDto {
  @IsNotEmpty()
  @IsEnum(StockType)
  readonly type: StockType;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly price: number;


  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly amount: number;

  @IsOptional()
  @IsOptional()
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  readonly accountedAt?: Date;

  @IsOptional()
  @IsOptional()
  @Transform(({value}) => new Date(moment(value).utc().format('YYYY-MM-DD')))
  readonly billedAt?: Date;

  @IsOptional()
  @IsString()
  readonly billCode?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly discount?: number;

  @IsOptional()
  @IsEnum(DiscountType)
  readonly discountType?: DiscountType;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly tax: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly productId: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly branchId: number;

  @IsNotEmpty()
  @IsArray()
  readonly consignmentIds: number[];
}
