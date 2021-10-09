import {DatetimeUnit} from "@prisma/client";

export interface SearchSalaryDto {
  datetime: Date;
  title: string
  unit: DatetimeUnit
}
