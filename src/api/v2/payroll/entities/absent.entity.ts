import {AbsentSalary, SalarySetting, Salaryv2} from "@prisma/client";

export interface AbsentEntity extends AbsentSalary {
  readonly setting: SalarySetting;
  readonly salaries: Salaryv2[];
}
