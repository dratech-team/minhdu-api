import {Payroll, Salary} from "@prisma/client";

export interface FullPayroll extends Payroll {
  salaries: Salary[]
}
