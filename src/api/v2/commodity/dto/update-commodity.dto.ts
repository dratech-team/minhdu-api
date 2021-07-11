import {CreateCommodityDto} from './create-commodity.dto';
import {PartialType} from "@nestjs/mapped-types";
import {IsNumber, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class UpdateCommodityDto extends PartialType(CreateCommodityDto) {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly orderId: number;
}
