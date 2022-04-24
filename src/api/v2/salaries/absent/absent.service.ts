import {Injectable} from '@nestjs/common';
import {CreateAbsentDto} from './dto/create-absent.dto';
import {UpdateAbsentDto} from './dto/update-absent.dto';
import {AbsentRepository} from "./absent.repository";
import {AbsentSalary} from '@prisma/client';
import {DeleteMultipleAbsentDto} from "./dto/delete-multiple-absent.dto";
import {CreateAbsentEntity} from "./entities/create-absent.entity";
import {crudManyResponse} from "../base/functions/response.function";

@Injectable()
export class AbsentService {
  constructor(private readonly repository: AbsentRepository) {
  }

  async createMany(body: CreateAbsentDto) {
    const salaries = body.payrollIds.map(payrollId => {
      return this.mapToAbsent(Object.assign(body, {payrollId}));
    }) as AbsentSalary[];
    const {count} = await this.repository.createMany(salaries);
    return crudManyResponse(count, "creation");
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} absent`;
  }

  async updateMany(body: UpdateAbsentDto) {
    const {count} = await this.repository.update(body.payrollIds, this.mapToAbsent(body));
    return crudManyResponse(count, "updation");
  }

  async removeMany(body: DeleteMultipleAbsentDto) {
    const {count} = await this.repository.removeMany(body);
    return crudManyResponse(count, "deletion");
  }

  private mapToAbsent(body): Omit<AbsentSalary, "id"> {
    return {
      payrollId: body.payrollId,
      title: body.title,
      partial: body.partial,
      price: body.price,
      startedAt: body.startedAt,
      endedAt: body.endedAt,
      startTime: body.startTime,
      endTime: body.endTime,
      note: body.note,
      unit: body.unit,
      settingId: body.settingId,
      blockId: body?.blockId || 5,
    } as CreateAbsentEntity;
  }
}
