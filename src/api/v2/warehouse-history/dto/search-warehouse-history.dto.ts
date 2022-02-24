import {IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";
import { WarehouseHistoryType } from "@prisma/client";

export class SearchWarehouseHistoryDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly take: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly skip: number;

  @IsNotEmpty()
  @IsEnum(WarehouseHistoryType)
  readonly historyType: WarehouseHistoryType;

  @IsOptional()
  @IsString()
  readonly product: string;
}
