import {
  Branch,
  Employee,
  OvertimeTemplate,
  Position,
  WorkHistory,
} from "@prisma/client";

export interface FullPosition extends Position {
  branches: Branch[];
}

export type OnePosition = Position & {
  employees: Employee[];
  workHistories: WorkHistory[];
  templates: OvertimeTemplate[];
};
