import {AllowanceSalary, Branch, SalaryBlock} from "@prisma/client";

export interface AllowanceEntity extends AllowanceSalary {
  readonly branch: Branch;
  readonly block: SalaryBlock;
}
