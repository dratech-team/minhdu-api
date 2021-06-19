import {Degree} from "@prisma/client";
import {CreateDegreeDto} from "./dto/create-degree.dto";
import {ResponsePagination} from "../../../common/entities/response.pagination";
import {UpdateDegreeDto} from "./dto/update-degree.dto";

export interface BaseDegreeService {
  create(body: CreateDegreeDto): Promise<Degree>;

  findAll(employeeId: number, skip: number, take: number, search?: string): Promise<ResponsePagination<Degree>>;

  findBy(employeeId: number, query: any): Promise<Degree[]>;

  findOne(id: number): Promise<Degree>;

  update(id: number, update: UpdateDegreeDto): Promise<Degree>;

  remove(id: number): void;
}
