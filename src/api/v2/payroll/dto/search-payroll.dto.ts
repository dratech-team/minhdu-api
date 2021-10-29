import {EmployeeType} from "@prisma/client";

export interface SearchPayrollDto {
  readonly employeeId: number;
  readonly name: string;
  readonly employeeType: EmployeeType;
  readonly branch: string;
  readonly position: string;
  readonly createdAt: Date;
  readonly isConfirm: number;
  readonly isPaid: number;
  readonly isTimeSheet: boolean;
}
