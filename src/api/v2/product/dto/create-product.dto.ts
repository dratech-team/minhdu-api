import {IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString,} from "class-validator";
import {Transform, Type} from "class-transformer";
import {ProductUnit} from "@prisma/client";

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
      return new Date(val.value);
    }
  })
  readonly mfg?: Date;

  @IsOptional()
  @Transform((val) => {
    if (val.value) {
      return new Date(val.value);
    }
  })
  readonly exp?: Date;

  @IsOptional()
  @IsDate()
  @Transform((val) => {
    if (val.value) {
      return new Date(val.value);
    }
  })
  readonly accountedAt?: Date;

  @IsOptional()
  @IsDate()
  @Transform((val) => {
    if (val.value) {
      return new Date(val.value);
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
  readonly warehouseId?: number;

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
  readonly providerId: number;

  @IsOptional()
  @IsString()
  readonly provider?: string;

  @IsNotEmpty()
  @IsEnum(ProductUnit)
  readonly unit: ProductUnit;

  @IsOptional()
  @IsString()
  readonly note?: string;
}
