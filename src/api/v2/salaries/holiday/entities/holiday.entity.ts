import {HolidaySalary} from "@prisma/client";
import {SalarySettingsEntity} from "../../../../v1/settings/salary/entities/salary-settings.entity";

export interface HolidayEntity extends HolidaySalary {
  readonly setting: SalarySettingsEntity;
}
