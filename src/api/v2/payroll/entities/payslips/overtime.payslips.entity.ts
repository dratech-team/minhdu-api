import {OvertimeEntity} from "../../../salaries/overtime/entities/overtime.entity";
import {Salaryv2} from "@prisma/client";

export type OvertimePayslipsEntity = OvertimeEntity [] & { salaries: Salaryv2[] };
