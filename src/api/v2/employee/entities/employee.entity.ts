import {District, Employee, Nation, Payroll, Position, Province, Salary, Ward} from "@prisma/client";
import {FullPosition} from "../../../../common/branches/position/entities/position.entity";

export interface FullEmployee extends Employee {
  position: FullPosition;
  salaries: Salary[];
  payrolls: Payroll[];
}

// export type FullEmployee = (Employee & { ward: Ward & { district: District & { province: Province & { nation: Nation; }; }; }; position: Position })[]
