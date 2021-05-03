import {OmitType} from "@nestjs/mapped-types";
import {CreatePayrollDto} from "./create-payroll.dto";

export class UpdateSalaryPayrollDto extends OmitType(CreatePayrollDto, ['employeeId'] as const) {
}