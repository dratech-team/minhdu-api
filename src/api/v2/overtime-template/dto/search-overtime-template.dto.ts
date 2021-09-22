import { DatetimeUnit, SalaryType } from "@prisma/client";

export interface SearchOvertimeTemplateDto {
  title: string;
  positionId: number;
  // type: SalaryType;
  price: number;
  department: string;
  unit: DatetimeUnit;
}
