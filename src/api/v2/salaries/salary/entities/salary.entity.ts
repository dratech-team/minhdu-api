import {CreateSalaryDto} from "../dto/create-salary.dto";

export type SalaryEntity = Omit<CreateSalaryDto, "payrollIds"> & { payrollId: number }
