import {PartialType} from "@nestjs/mapped-types";
import {CreateCommodityDto} from "../../commodity/dto/create-commodity.dto";

export class UpdateBillDto extends PartialType(CreateCommodityDto) {

}
