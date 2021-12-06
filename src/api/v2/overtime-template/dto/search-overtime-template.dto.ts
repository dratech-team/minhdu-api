import { DatetimeUnit, SalaryType } from "@prisma/client";

export interface SearchOvertimeTemplateDto {
  title: string;
  branchId: number;
  positions: string[];
  // type: SalaryType;
  price: number;
  unit: DatetimeUnit;
}
