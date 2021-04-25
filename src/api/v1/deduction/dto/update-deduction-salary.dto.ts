import {PartialType} from "@nestjs/mapped-types";
import {CreateDeductionSalaryDto} from "./create-deduction-salary.dto";

export class UpdateDeductionSalaryDto extends PartialType(CreateDeductionSalaryDto) {
}
