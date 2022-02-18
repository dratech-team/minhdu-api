import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {Type} from "class-transformer";

export class SearchProductDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly take: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly skip: number;

  @IsOptional()
  // @IsNumber()
  @Type(() => Number)
  readonly warehouseId: number;

  @IsOptional()
  @IsString()
  readonly name: string;
}
