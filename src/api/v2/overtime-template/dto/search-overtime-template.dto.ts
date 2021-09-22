import {DatetimeUnit, SalaryType} from "@prisma/client";

export interface SearchOvertimeTemplateDto {
  title: string;
  // type: SalaryType;
  price: number;
  department: string;
  unit: DatetimeUnit;
}
