import {CreateSalaryDto} from "./dto/create-salary.dto";
import {Salary} from "@prisma/client";
import {ResponsePagination} from "../../../common/entities/response.pagination";
import {UpdateSalaryDto} from "./dto/update-salary.dto";

export interface BaseSalaryService {
  create(body: CreateSalaryDto): Promise<Salary>;

  findAll(employeeId: number, skip: number, take: number, search?: string): Promise<ResponsePagination<Salary>>;

  findBy(employeeId: number, query: any): Promise<Salary[]>;

  findOne(id: number): Promise<Salary>;

  update(id: number, update: UpdateSalaryDto): Promise<Salary>;

  remove(id: number): void;

  /*
  * Tạo lịch sử lương mới cho nhân viên mỗi khi lương được sửa
  * */
  createHistory(): Promise<void>;
}
