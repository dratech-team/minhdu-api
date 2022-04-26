import {Payroll, Salary} from "@prisma/client";

export type FullSalary = Salary & { allowance?: Salary }

export type OneSalary = Salary & { payroll: Payroll }


export type RageDate = { start: Date; end: Date };
