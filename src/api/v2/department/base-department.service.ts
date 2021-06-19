import {CreateDepartmentDto} from "./dto/create-department.dto";
import {Department} from "@prisma/client";
import {ResponsePagination} from "../../../common/entities/response.pagination";
import {UpdateDepartmentDto} from "./dto/update-department.dto";

export interface BaseDepartmentService {
  create(body: CreateDepartmentDto): Promise<Department>;

  findAll(): Promise<ResponsePagination<Department>>

  findOne(id: number): Promise<Department>;

  update(id: number, updates: UpdateDepartmentDto): Promise<Department>;

  remove(id: number): void;
}
