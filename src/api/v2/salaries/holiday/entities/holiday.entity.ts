import {HolidaySalary, SalarySetting} from "@prisma/client";

export interface HolidayEntity extends HolidaySalary {
  readonly setting: SalarySetting
}
