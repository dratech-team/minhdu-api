import {AllowanceSalary, DayOffSalary, DeductionSalary, Payroll, Salary, Salaryv2} from "@prisma/client";
import {AbsentEntity} from "../../../v1/payroll/entities/absent.entity";
import {RemoteEntity} from "../../../v1/salaries/remote/entities/remote.entity";
import {OvertimeEntity} from "../../../v1/salaries/overtime/entities";
import {HolidayEntity} from "../../salaries/holiday/entities/holiday.entity";
import {OneEmployee} from "../../../v1/employee/entities/employee.entity";

export interface PayrollEntity extends Payroll {
  readonly employee: OneEmployee;
  readonly salaries: Salary[];
  readonly salariesv2: Salaryv2[];
  readonly absents: AbsentEntity[];
  readonly deductions: DeductionSalary[];
  readonly overtimes: OvertimeEntity[];
  readonly dayoffs: DayOffSalary[];
  readonly allowances: AllowanceSalary[];
  readonly remotes: RemoteEntity[];
  readonly holidays: HolidayEntity[];
}

