import {Employee} from "@prisma/client";
import {CreateEmployeeDto} from "./dto/create-employee.dto";
import {UpdateEmployeeDto} from "./dto/update-employee.dto";
import {ResponsePagination} from "../../../common/entities/response.pagination";

export interface BaseEmployeeService {
  create(body: CreateEmployeeDto): Promise<Employee>;

  findAll(branchId: number, skip: number, take: number, search?: string): Promise<ResponsePagination<Employee>>;

  findBy(query: any): Promise<Employee[]>;

  findOne(id: number): Promise<Employee>;

  update(id: number, updates: UpdateEmployeeDto): Promise<Employee>;

  remove(id: number): void;
}
