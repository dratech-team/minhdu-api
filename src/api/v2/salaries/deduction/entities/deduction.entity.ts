import {DeductionSalary, SalaryBlock} from "@prisma/client";

export interface DeductionEntity extends DeductionSalary {
  readonly block: SalaryBlock;
}
