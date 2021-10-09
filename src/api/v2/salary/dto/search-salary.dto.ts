import {DatetimeUnit} from "@prisma/client";

export interface SearchSalaryDto {
  createdAt: Date;
  title: string;
  unit: DatetimeUnit;
  position: string;
  employeeId: number;
}
