import {Payroll, Salary} from "@prisma/client";

export type OneSalary = Salary & { payroll: Payroll }
