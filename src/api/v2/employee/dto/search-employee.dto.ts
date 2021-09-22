import {GenderType} from "@prisma/client";

export interface SearchEmployeeDto {
  code: string,
  name: string,
  gender: GenderType,
  createdAt: Date,
  workedAt: Date,
  isFlatSalary: boolean, // 0 | 1
  branch: string,
  branchId: number,
  department: string,
  position: string,
}
