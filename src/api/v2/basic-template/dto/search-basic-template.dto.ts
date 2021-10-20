import {SalaryType} from "@prisma/client";

export interface SearchBasicTemplateDto {
  readonly type: SalaryType;
}
