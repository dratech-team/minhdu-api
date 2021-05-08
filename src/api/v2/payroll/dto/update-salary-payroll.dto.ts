import {PartialType} from "@nestjs/mapped-types";
import {CreatePayrollDto} from "./create-payroll.dto";

export class UpdateSalaryPayrollDto extends PartialType(CreatePayrollDto) {
}