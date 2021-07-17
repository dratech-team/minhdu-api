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
  @IsDate()
  @Type(() => Date)
  @Transform((val) => new Date(val.value))
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

  debt: number;

  @IsOptional()
  @IsArray()
  readonly commodityIds: number[];

  @IsNotEmpty()
  @IsNumber()
  readonly destinationId: number;

  // @IsOptional()
  // @IsArray()
  // readonly routes: CreateRoutes;
}
