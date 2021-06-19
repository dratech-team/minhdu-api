import {SalaryHistory} from "@prisma/client";
import {CreateSalaryHistoryDto} from "./dto/create-salary-history.dto";
import {UpdateSalaryHistoryDto} from "./dto/update-salary-history.dto";

export interface BaseSalaryHistoryService {
  create(body: CreateSalaryHistoryDto): Promise<SalaryHistory>;

  findAll(employeeId: number, search?: string): Promise<SalaryHistory[]>;

  findOne(id: number): Promise<SalaryHistory>;

  update(id: number, update: UpdateSalaryHistoryDto): Promise<SalaryHistory>;

  remove(id: number): void;
}
