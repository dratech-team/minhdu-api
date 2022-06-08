import {RateCodition, SalarySetting} from "@prisma/client";

export interface SalarySettingsEntity extends SalarySetting {
  readonly rateCondition: RateCodition;
}
