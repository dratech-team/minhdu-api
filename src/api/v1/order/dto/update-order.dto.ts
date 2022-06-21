import {PartialType} from "@nestjs/mapped-types";
import {CreateOrderDto} from "./create-order.dto";
import {IsBoolean, IsNumber, IsObject, IsOptional} from "class-validator";
import {Type} from "class-transformer";
import {UpdateCommodityDto} from "../../commodity/dto/update-commodity.dto";

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  readonly hide: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly total: number;

  @IsOptional()
  @IsObject({each: true})
  readonly commidity: UpdateCommodityDto;
}
