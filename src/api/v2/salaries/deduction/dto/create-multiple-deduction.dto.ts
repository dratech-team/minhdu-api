import {CreateDeductionDto} from "./create-deduction.dto";
import {OmitType} from "@nestjs/mapped-types";

export class CreateMultipleDeductionDto extends OmitType(CreateDeductionDto, ["payrollIds", "settingId"]) {
  readonly payrollId: number;
}
