import {OvertimeAllowanceSalary, OvertimeSalary, SalaryBlock, SalarySetting} from "@prisma/client";
import {SalarySettingsEntity} from "../../../settings/salary/entities/salary-settings.entity";

export interface OvertimeEntity extends OvertimeSalary {
  readonly allowances: OvertimeAllowanceSalary[];
  readonly setting: SalarySettingsEntity;
  readonly block: SalaryBlock;
}
