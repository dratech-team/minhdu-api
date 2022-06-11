export interface PayslipEntity {
  readonly basicSalary: number;
  readonly staySalary: number;
  readonly allowanceSalary: number;
  readonly overtime: {
    duration: {
      day: number;
      hour: number;
      minute: number;
    }
    total: number;
  }
  readonly deductionSalary: number;
  readonly absent: {
    duration: {
      paidLeave: number;
      unpaidLeave: number;
    },
    total: number;
  }
  readonly holiday: {
    working: { duration: number; total: number}
    unworking: { duration: number; total: number}
  }
  readonly workday: { duration: number; total: number}
  readonly tax: number;
  readonly total: number;
}
