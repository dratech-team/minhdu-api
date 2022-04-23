import {CreateAbsentDto} from "../dto/create-absent.dto";

export type CreateAbsentEntity = Omit<CreateAbsentDto, "payrollIds"> & { payrollId: number }
