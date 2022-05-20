import {SalarySetting, Salaryv2} from "@prisma/client";

export type SettingPayslipsEntity = SalarySetting & { salaries: Salaryv2[] };
