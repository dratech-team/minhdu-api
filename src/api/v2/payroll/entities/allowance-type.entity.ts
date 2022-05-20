import {AllowanceSalary} from "@prisma/client";

export type AllowanceType = AllowanceSalary & { datetime: Date, duration: number };
