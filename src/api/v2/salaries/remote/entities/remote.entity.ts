import {RemoteSalary, SalaryBlock} from "@prisma/client";

export interface RemoteEntity extends RemoteSalary {
  readonly block: SalaryBlock;
}
