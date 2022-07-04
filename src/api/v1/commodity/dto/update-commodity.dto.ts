import {CreateCommodityDto} from './create-commodity.dto';
import {PartialType} from "@nestjs/mapped-types";
import {IsBoolean, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class UpdateCommodityDto extends PartialType(CreateCommodityDto) {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  readonly historied: boolean;
}
