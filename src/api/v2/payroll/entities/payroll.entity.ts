import {AllowanceSalary, DayOffSalary, DeductionSalary, Payroll, Salary, Salaryv2} from "@prisma/client";
import {AbsentEntity} from "../../../v1/payroll/entities/absent.entity";
import {RemoteEntity} from "../../../v1/salaries/remote/entities/remote.entity";
import {OvertimeEntity} from "../../../v1/salaries/overtime/entities";
import {HolidayEntity} from "../../salaries/holiday/entities/holiday.entity";
import {OneEmployee} from "../../../v1/employee/entities/employee.entity";
import {HandleOvertimeEntity} from "./handle-overtime.entity";

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

export type ResponsePayrollEntity = PayrollEntity & {
  readonly actualday: number,
  readonly basicSalary: number,
  readonly workday: number,
  readonly actualDay: number,
  readonly staySalary: number,
  readonly allowances: (AllowanceSalary & { total: number, duration: number })[],
  readonly absents: (AbsentEntity & { price: number, duration: number, total: number })[],
  readonly dayoffs: (DayOffSalary & { duration: number })[],
  readonly  remotes: (RemoteEntity & {duration: number, total: number})[],
  readonly  overtimes: (OvertimeEntity & {duration: number, total: number, details: HandleOvertimeEntity[]})[],
  readonly holidays: (HolidayEntity & {duraion: number, total: number, details: any})[],
  readonly total: number
}

