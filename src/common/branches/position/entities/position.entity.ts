import {
  Branch,
  Employee,
  OvertimeTemplate,
  Position,
} from "@prisma/client";

export interface FullPosition extends Position {
  branches: Branch[];
}

export type OnePosition = Position & {
  employees: Employee[];
  templates: OvertimeTemplate[];
};
