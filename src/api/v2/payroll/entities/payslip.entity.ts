export type PayslipEntity = {
  basic: number,
  stay: number,
  overtime: number,
  allowance: number,
  payslipInHoliday: number,
  payslipNotInHoliday: number,
  workdayNotInHoliday: number,
  worksInHoliday: number,
  worksNotInHoliday: number,
  deduction: number,
  daySalary: number,
  totalWorkday: number,
  workday: number,
  bsc: number,
  bscSalary: number,
  payslipNormalDay: number,
  tax: number,
  total: number,
}

export type Workday = {
  day: number;
  datetime: Date;
  rate: number; // 1, 2, 3
}
