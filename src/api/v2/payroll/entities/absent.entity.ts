import {AbsentSalary, Salaryv2} from "@prisma/client";
import {SettingPayslipsEntity} from "./payslips";

export interface AbsentEntity extends AbsentSalary {
  readonly setting: SettingPayslipsEntity;
  readonly salaries: Salaryv2[];
}
