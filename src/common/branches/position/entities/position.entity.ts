import {Employee, OvertimeTemplate, Position, WorkHistory} from "@prisma/client";
import {FullDepartment} from "../../department/entities/department.entity";

export interface FullPosition extends Position {
  department: FullDepartment[];
}

export type OnePosition =
  Position
  & { employees: Employee[], workHistories: WorkHistory[], templates: OvertimeTemplate[] }
