export interface SearchPayrollDto {
  readonly code: string;
  readonly name: string;
  readonly branch: string;
  readonly department: string;
  readonly position: string;
  readonly createdAt: Date;
  readonly isConfirm: number;
  readonly isPaid: number;
}
