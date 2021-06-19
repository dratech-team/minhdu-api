import {Injectable} from '@nestjs/common';
import {CreateDegreeDto} from './dto/create-degree.dto';
import {UpdateDegreeDto} from './dto/update-degree.dto';
import {BaseDegreeService} from "./base-degree.service";
import {DegreeRepository} from "./degree.repository";
import {ResponsePagination} from "../../../common/entities/response.pagination";
import {Degree} from "@prisma/client";

@Injectable()
export class DegreeService implements BaseDegreeService {
  constructor(private readonly repository: DegreeRepository) {
  }

  create(createDegreeDto: CreateDegreeDto) {
    return this.repository.create(createDegreeDto);
  }

  async findAll(employeeId: number, skip: number, take: number, search?: string): Promise<ResponsePagination<Degree>> {
    return await this.repository.findAll(employeeId, skip, take, search);
  }

  findBy(employeeId: number, query: any): Promise<[]> {
    return Promise.resolve([]);
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  update(id: number, updateDegreeDto: UpdateDegreeDto) {
    return this.repository.update(id, updateDegreeDto);
  }

  remove(id: number) {
    this.repository.remove(id);
  }
}
