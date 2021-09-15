import {Position} from "@prisma/client";
import {FullDepartment} from "../../department/entities/department.entity";

export interface FullPosition extends Position {
  department: FullDepartment[];
}
