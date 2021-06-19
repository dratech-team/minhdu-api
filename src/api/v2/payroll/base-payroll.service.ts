import {Payroll, Salary} from "@prisma/client";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {ResponsePagination} from "../../../common/entities/response.pagination";
import {UpdatePayrollDto} from "./dto/update-payroll.dto";

export interface BasePayrollService {
  create(body: CreatePayrollDto): Promise<any>;

  checkCurrentExist(currentDate: Date, employeeId: number): Promise<boolean>;

  findAll(branchId: number, skip: number, take: number, search?: string): Promise<ResponsePagination<any>>;

  findOne(id: number): Promise<any>;

  update(id: number, update: UpdatePayrollDto): Promise<any>;

  remove(id: number): void;

  totalAbsent(salaries: Salary[]): number;

  totalSalary(payroll: any): any;

  generatePayroll(branchId: number): Promise<boolean>;
}
