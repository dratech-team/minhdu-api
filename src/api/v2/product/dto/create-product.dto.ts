import {IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString,} from "class-validator";
import {Transform, Type} from "class-transformer";
import {ProductUnit} from "@prisma/client";
import * as moment from "moment";

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly code?: string;

  @IsOptional()
  @Transform((val) => {
    if (val.value) {
      return new Date(moment(val.value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly mfg?: Date;

  @IsOptional()
  @Transform((val) => {
    if (val.value) {
      return new Date(moment(val.value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly exp?: Date;

  @IsOptional()
  @IsDate()
  @Transform((val) => {
    if (val.value) {
      return new Date(moment(val.value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly accountedAt?: Date;

  @IsOptional()
  @IsDate()
  @Transform((val) => {
    if (val.value) {
      return new Date(moment(val.value).utc().format('YYYY-MM-DD'));
    }
  })
  readonly billedAt?: Date;

  @IsOptional()
  @IsString()
  readonly billCode?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly branchId?: number;

  @IsOptional()
  @IsString()
  readonly branch?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly categoryId?: number;

  @IsOptional()
  @IsString()
  readonly warehouse?: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly price: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly amount: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly discount: number;

  @IsOptional()
  @Type(() => Number)
  readonly supplierId: number;

  @IsOptional()
  @IsString()
  readonly supplier?: string;

  @IsNotEmpty()
  @IsEnum(ProductUnit)
  readonly unit: ProductUnit;

  @IsOptional()
  @IsString()
  readonly note?: string;
}
