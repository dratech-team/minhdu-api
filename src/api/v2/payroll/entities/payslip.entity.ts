export type PayslipEntity = {
  basic: number;
  totalStandard: number;
  workday: number;
  overtime: number;
  deduction: number;
  daySalary: number;
  workdayNotInHoliday: number;
  worksInHoliday: Workday[];
  worksNotInHoliday: Workday[];
  totalWorkday: number;
  payslipNormalDay: number;
  payslipInHoliday: number;
  payslipNotInHoliday: number;
  stay: number;
  payslipOutOfWorkday: number;
  allowance: number;
  tax: number;
  total: number;
}

export type Workday = {
  day: number;
  datetime: Date;
  rate: number; // 1, 2, 3
}
