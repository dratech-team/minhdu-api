import {OvertimeEntity} from "../../../v1/salaries/overtime/entities";
import {HolidayEntity} from "../../salaries/holiday/entities/holiday.entity";

export type HandleOvertimeEntity =
  OvertimeEntity | HolidayEntity
  & { price: number, rate: number, datetime: Date, duration: number, total: number }
