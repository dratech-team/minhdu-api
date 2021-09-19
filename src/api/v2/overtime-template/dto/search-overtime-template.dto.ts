import {SalaryType} from "@prisma/client";

export interface SearchOvertimeTemplateDto {
  title: string;
  type: SalaryType;
  price: number;
  branch: string;
}
