import {CreateCommodityDto} from './create-commodity.dto';
import {PartialType} from "@nestjs/mapped-types";

export class UpdateCommodityDto extends PartialType(CreateCommodityDto) {
}
