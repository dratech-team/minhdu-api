import {Branch, Department} from "@prisma/client";

export interface FullDepartment extends Department {
  branch: Branch[];
}
