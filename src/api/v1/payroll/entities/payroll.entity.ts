import {Payroll, Salary, Salaryv2} from "@prisma/client";
import {FullSalary} from "../../salaries/salary/entities/salary.entity";
import {AbsentEntity} from "./absent.entity";
import {OvertimeEntity} from "../../salaries/overtime/entities";
import {DeductionEntity} from "../../salaries/deduction/entities";
import {AllowanceEntity} from "../../salaries/allowance/entities";
import {OneEmployee} from "../../employee/entities/employee.entity";
import {RemoteEntity} from "../../salaries/remote/entities/remote.entity";

export type RangeDateTime = { start: Date; end: Date };

// Loại bỏ datetime trong Salary và thay vào đó là datetime có kiểu là từ ngày tới ngày, hăojc 1 ngày, hoặc rỗng
// case từ ngày tới ngày: Áp dụng cho các phụ cấp dài ngày được tính giá theo ngày qui định từ ngày tới ngày
// case 1 ngày. Phụ cấp áp dụng cho 1 ngày. đơn vị tính / ngày
// case null: Phụ cấp được áp dụng theo ngày đi làm thực tế. làm bao nhiêu ngày thì phụ cấp đó nhân với số ngày đi làm

export interface FullPayroll extends Payroll {
  salaries: Salary[];
}

export type OnePayroll = Payroll
  & { employee: OneEmployee }
  & { payrollIds: number[] }
  & {
  salaries: FullSalary[],
  salariesv2: Salaryv2[],
  absents: AbsentEntity[],
  deductions: DeductionEntity[],
  allowances: AllowanceEntity[],
  overtimes: OvertimeEntity[],
  remotes: RemoteEntity[],
};
