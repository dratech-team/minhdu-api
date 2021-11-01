import {EmployeeType, GenderType} from "@prisma/client";

export interface SearchEmployeeDto {
  name: string,
  gender: GenderType,
  createdAt: {
    datetime: Date,
    compare: 'gte' | 'lte' | 'in',
  },
  workedAt: Date,
  isFlatSalary: boolean, // 0 | 1
  branch: string,
  branchId: number,
  position: string,
  positionId: number,
  templateId: number,
  createdPayroll: Date,
  isLeft: boolean, // 0 | 1
  type: EmployeeType
}
