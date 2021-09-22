import { Branch, Contract, Employee, Payroll, Salary } from "@prisma/client";

export interface FullPayroll extends Payroll {
  salaries: Salary[];
}

export type OnePayroll = Payroll & {
  employee: {
    contracts: Contract[];
    position: { department: { branch: Branch }; workday: number };
  } & Employee;
} & { salaries: Salary[] };
