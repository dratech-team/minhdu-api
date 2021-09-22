import {Employee, Payroll, Salary} from "@prisma/client";

export interface FullPayroll extends Payroll {
  salaries: Salary[]
}

export type OnePayroll = Payroll & { employee: Employee };
