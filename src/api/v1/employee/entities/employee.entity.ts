import {Branch, Category, Contract, Employee, Payroll, Position} from "@prisma/client";

export interface OneEmployee extends Employee {
  contracts: Contract[];
  position: Position;
  branch: Branch;
  // payrolls: Payroll[];
  category: Category;
}

// export type FullEmployee = (Employee & { ward: Ward & { district: District & { province: Province & { nation: Nation; }; }; }; position: Position })[]
