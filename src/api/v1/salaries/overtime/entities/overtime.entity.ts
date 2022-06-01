import {OvertimeAllowanceSalary, OvertimeSalary, SalaryBlock, SalarySetting} from "@prisma/client";

export interface OvertimeEntity extends OvertimeSalary {
  readonly allowances: OvertimeAllowanceSalary[];
  readonly setting: SalarySetting;
  readonly block: SalaryBlock;
}
