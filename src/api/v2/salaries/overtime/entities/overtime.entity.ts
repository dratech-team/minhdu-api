import {AllowanceSalary, OvertimeSalary, SalaryBlock, SalarySetting} from "@prisma/client";

export interface OvertimeEntity extends OvertimeSalary {
  readonly allowances: AllowanceSalary[];
  readonly setting: SalarySetting;
  readonly block: SalaryBlock;
}
