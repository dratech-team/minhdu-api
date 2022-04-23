import {CreateDeductionDto} from "../dto/create-deduction.dto";

export type DeductionEntity = Omit<CreateDeductionDto, "payrollIds"> & { payrollId: number }
