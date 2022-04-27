import {PartialType} from "@nestjs/mapped-types";
import {CreateMultipleDeductionDto} from "./create-multiple-deduction.dto";

export class UpdateMultipleEuctionDto extends PartialType(CreateMultipleDeductionDto) {
}
