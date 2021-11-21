import {EmployeeType, SalaryType} from "@prisma/client";
import {FilterTypeEnum} from "../entities/filter-type.enum";

export interface SearchPayrollDto {
  readonly employeeId: number;
  readonly name: string;
  readonly employeeType: EmployeeType;
  readonly branch: string;
  readonly position: string;
  readonly createdAt: Date;
  readonly isConfirm: number;
  readonly isPaid: number;
  readonly salaryTitle: string;
  readonly salaryPrice: number;
  readonly salaryType: SalaryType;
  readonly filterType: FilterTypeEnum;
}
