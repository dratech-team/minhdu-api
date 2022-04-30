import {Branch, Contract, Employee, Payroll, Position} from "@prisma/client";

export interface OneEmployee extends Employee {
  branch: Branch;
  position: Position;
  payrolls: Payroll[];
  contracts: Contract[];
}

// export type FullEmployee = (Employee & { ward: Ward & { district: District & { province: Province & { nation: Nation; }; }; }; position: Position })[]
