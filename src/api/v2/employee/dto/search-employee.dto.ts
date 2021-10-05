import {GenderType} from "@prisma/client";

export interface SearchEmployeeDto {
  name: string,
  gender: GenderType,
  createdAt: Date,
  workedAt: Date,
  isFlatSalary: boolean, // 0 | 1
  branch: string,
  branchId: number,
  position: string,
  templateId: number,
  createdPayroll: Date,
}
