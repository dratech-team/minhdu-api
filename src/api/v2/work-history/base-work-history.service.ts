import {WorkHistory} from "@prisma/client";
import {CreateWorkHistoryDto} from "./dto/create-work-history.dto";
import {ResponsePagination} from "../../../common/entities/response.pagination";
import {UpdateWorkHistoryDto} from "./dto/update-work-history.dto";

export interface BaseWorkHistoryService {
  create(body: CreateWorkHistoryDto): Promise<WorkHistory>;

  findAll(employeeId: number, take: number, skip: number, search?: string): Promise<ResponsePagination<WorkHistory>>;

  findBy(employeeId: number, search?: string): Promise<WorkHistory[]>;

  findOne(id: number): Promise<WorkHistory>;

  update(id: number, update: UpdateWorkHistoryDto): Promise<WorkHistory>;

  remove(id: number): void;
}
