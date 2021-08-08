import {CurrencyUnit} from "@prisma/client";
import {Type} from "class-transformer";
import {IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

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
  @IsArray()
  readonly commodityIds: number[];

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  readonly destinationId: number;
}
