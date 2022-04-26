import {CreateRemoteDto} from "../dto";

export type RemoteEntity = Omit<CreateRemoteDto, "payrollIds"> & { payrollId: number }
