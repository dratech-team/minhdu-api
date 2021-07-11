import {CommodityUnit} from "@prisma/client";
import {IsEnum, IsNotEmpty, IsNumber, IsString} from "class-validator";
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

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly amount: number;
}
