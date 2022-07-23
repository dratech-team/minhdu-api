import {IsArray, IsNotEmpty, IsNumber, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class SearchCommodityDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly take?: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  readonly skip?: number;

  @IsOptional()
  @IsArray({each: true})
  @Type(() => Number)
  readonly orderIds?: number[];
}
