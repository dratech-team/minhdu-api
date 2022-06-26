import {CommodityUnit} from "@prisma/client";
import {IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class CreateCommodityDto {
  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEnum(CommodityUnit)
  readonly unit: CommodityUnit;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly amount: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly gift: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly more: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  readonly closed: boolean;
}
