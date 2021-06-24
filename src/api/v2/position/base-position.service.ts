import {CreatePositionDto} from "./dto/create-position.dto";
import {Position} from "@prisma/client";
import {ResponsePagination} from "../../../common/entities/response.pagination";
import {UpdatePositionDto} from "./dto/update-position.dto";

export interface BasePositionService {
  create(body: CreatePositionDto): Promise<Position>;

  findAll(): Promise<Position[]>;

  findOne(id: number): Promise<Position>;

  findBy(query: any): Promise<Position[]>;

  update(id: number, updates: UpdatePositionDto): Promise<Position>;

  remove(id: number): void;
}
