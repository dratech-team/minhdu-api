import {Injectable} from '@nestjs/common';
import {AbsentRepository} from "./absent.repository";
import {AbsentSalary} from '@prisma/client';
import {RemoveManyAbsentDto} from "./dto/remove-many-absent.dto";
import {crudManyResponse} from "../base/functions/response.function";
import * as _ from 'lodash';
import {CreateManyAbsentDto} from "./dto/create-many-absent.dto";
import {UpdateManyAbsentDto} from "./dto/update-many-absent.dto";
import {CreateAbsentDto} from "./dto/create-absent.dto";

@Injectable()
export class AbsentService {
  constructor(private readonly repository: AbsentRepository) {
  }

  async createMany(body: CreateManyAbsentDto) {
    const salaries = body.payrollIds.map(payrollId => {
      return this.mapToAbsent(Object.assign(_.omit(body, "payrollIds"), {payrollId}));
    }) as AbsentSalary[];
    console.log(salaries);
    const {count} = await this.repository.createMany(salaries);
    return crudManyResponse(count, "creation");
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} absent`;
  }

  async updateMany(body: UpdateManyAbsentDto) {
    const {count} = await this.repository.update(body.salaryIds, this.mapToAbsent(body));
    return crudManyResponse(count, "updation");
  }

  async removeMany(body: RemoveManyAbsentDto) {
    const {count} = await this.repository.removeMany(body);
    return crudManyResponse(count, "deletion");
  }

  private mapToAbsent(body): CreateAbsentDto {
    return {
      payrollId: body.payrollId,
      title: body.title,
      partial: body.partial,
      startedAt: body.startedAt,
      endedAt: body.endedAt,
      startTime: body.startTime,
      endTime: body.endTime,
      note: body.note,
      unit: body.unit,
      settingId: body.settingId,
      blockId: body?.blockId || 5,
    } as CreateAbsentDto;
  }
}
