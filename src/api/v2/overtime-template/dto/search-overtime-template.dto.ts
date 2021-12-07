import { DatetimeUnit, SalaryType } from "@prisma/client";

export interface SearchOvertimeTemplateDto {
  title: string;
  branchId: number;
  positionIds: number[];
  // type: SalaryType;
  price: number;
  unit: DatetimeUnit;
}
