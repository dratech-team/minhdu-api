import {DatetimeUnit} from "@prisma/client";

export class SearchEmployeeByOvertimeDto {
  readonly title: string;
  readonly datetime: Date;
  readonly times: number;
  readonly unit: DatetimeUnit;
}
