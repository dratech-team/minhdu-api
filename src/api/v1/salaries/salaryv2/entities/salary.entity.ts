import {CreateSalaryv2Dto} from "../dto/create-salaryv2.dto";

export type SalaryEntity = Omit<CreateSalaryv2Dto, "payrollIds"> & { payrollId: number }
