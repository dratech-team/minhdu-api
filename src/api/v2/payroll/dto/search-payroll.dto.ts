export interface SearchPayrollDto {
  readonly employeeId: number;
  readonly name: string;
  readonly branch: string;
  readonly position: string;
  readonly createdAt: Date;
  readonly isConfirm: number;
  readonly isPaid: number;
}
