import {AbsentSalary, SalarySetting} from "@prisma/client";

export interface AbsentEntity extends AbsentSalary {
  readonly setting?: SalarySetting
}
