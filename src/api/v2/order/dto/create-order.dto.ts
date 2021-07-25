import {CurrencyUnit} from "@prisma/client";
import {Transform, Type} from "class-transformer";
import {IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from "class-validator";
import {CreateCommodityDto} from "../../commodity/dto/create-commodity.dto";

export class CreateOrderDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly customerId: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  readonly createdAt: Date;

  @IsOptional()
  @IsString()
  readonly explain: string;

  @IsOptional()
  @IsEnum(CurrencyUnit)
  readonly currency: CurrencyUnit;

  @IsOptional()
  @ValidateNested()
  readonly commodity: CreateCommodityDto;

  @IsOptional()
  @IsArray()
  readonly commodityIds: number[];

  @IsNotEmpty()
  @IsNumber()
  readonly destinationId: number;
}
