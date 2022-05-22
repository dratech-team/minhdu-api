import {AllowanceSalary, DayOffSalary, DeductionSalary, Payroll, Salaryv2} from "@prisma/client";
import {AbsentEntity} from "../../../v1/payroll/entities/absent.entity";
import {RemoteEntity} from "../../../v1/salaries/remote/entities/remote.entity";
import {OvertimeEntity} from "../../../v1/salaries/overtime/entities";
import {HolidayEntity} from "../../salaries/holiday/entities/holiday.entity";

export interface PayrollEntity extends Payroll {
  readonly salariesv2: Salaryv2;
  readonly absents: AbsentEntity;
  readonly deductions: DeductionSalary;
  readonly remotes: RemoteEntity;
  readonly overtimes: OvertimeEntity;
  readonly dayoffs: DayOffSalary;
  readonly allowances: AllowanceSalary;
  readonly holidays: HolidayEntity;
}
