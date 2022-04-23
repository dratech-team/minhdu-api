import {CreateAbsentDto} from "../dto/create-absent.dto";

export type AbsentEntity = Omit<CreateAbsentDto, "payrollIds"> & { payrollId: number }
