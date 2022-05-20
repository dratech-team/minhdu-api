export type PayslipEntity = {
  basic: number;
  stay: number;
  allowance: number;
  overtime: Unit;
  holiday: Unit;
  notHoliday: Unit;
  deduction: {
    absent: Unit;
    late: Unit;
  };
  bsc: Unit;
  workday: number;
  daySalary: number;
  totalWorkday: Unit;
  tax: number;
  total: number;
}

export type Unit = {
  readonly times: number;
  readonly price: number;
}

export type Workday = {
  day: number;
  datetime: Date;
  rate: number; // 1, 2, 3
}
