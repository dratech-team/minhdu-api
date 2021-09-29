import { Branch, Contract, Employee, Payroll, Salary } from "@prisma/client";

export type RangeDateTime = { start: Date; end: Date };

// Loại bỏ datetime trong Salary và thay vào đó là datetime có kiểu là từ ngày tới ngày, hăojc 1 ngày, hoặc rỗng
// case từ ngày tới ngày: Áp dụng cho các phụ cấp dài ngày được tính giá theo ngày qui định từ ngày tới ngày
// case 1 ngày. Phụ cấp áp dụng cho 1 ngày. đơn vị tính / ngày
// case null: Phụ cấp được áp dụng theo ngày đi làm thực tế. làm bao nhiêu ngày thì phụ cấp đó nhân với số ngày đi làm

export interface FullPayroll extends Payroll {
  salaries: Salary[];
}

export type OnePayroll = Payroll & {
  employee: {
    contracts: Contract[];
    position: { name: string; workday: number };
  } & Employee;
} & { salaries: Salary[] };
