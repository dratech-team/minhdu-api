import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";
import { WarehouseUnit } from "@prisma/client";

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly code?: string;

  @IsOptional()
  @IsDate()
  @Type()
  readonly mfg?: Date;

  @IsOptional()
  @IsDate()
  @Type()
  readonly exp?: Date;

  @IsOptional()
  @IsDate()
  @Type()
  readonly accountedAt?: Date;

  @IsOptional()
  @IsDate()
  @Type()
  readonly billedAt?: Date;

  @IsNotEmpty()
  @IsString()
  readonly billCode?: string;

  @IsOptional()
  @IsString()
  readonly branch?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly branchId?: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly warehouseId?: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly price: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly amount: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly discount: number;

  @IsOptional()
  @Type(() => Number)
  readonly providerId: number;

  @IsNotEmpty()
  @IsEnum(WarehouseUnit)
  readonly unit: WarehouseUnit;

  @IsOptional()
  @IsString()
  readonly note?: string;
}
