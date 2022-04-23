import {CreateRemoteDto} from "../dto/create-remote.dto";

export type RemoteEntity = Omit<CreateRemoteDto, "payrollIds"> & { payrollId: number }
