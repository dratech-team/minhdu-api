import {GenderType} from "@prisma/client";

export interface SearchEmployeeDto {
  code: string,
  name: string,
  gender: GenderType,
  createdAt: Date,
  isFlatSalary: number, // 0 | 1
  branch: string,
  department: string,
  position: string,
}
