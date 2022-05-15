import {Injectable} from '@nestjs/common';
import {UpdateSalaryv2Dto} from './dto/update-salaryv2.dto';
import {Salaryv2Repository} from "./salaryv2.repository";
import {SalaryEntity} from "./entities/salary.entity";
import {crudManyResponse} from "../base/functions/response.function";
import {SalaryType} from "@prisma/client";
import {CreateManySalaryv2Dto} from "./dto/create-many-salaryv2.dto";
import {UpdateManySalaryv2Dto} from "./dto/update-many-salaryv2.dto";
import {RemoteManySalaryv2Dto} from "./dto/remote-many-salaryv2.dto";

@Injectable()
export class Salaryv2Service {
  constructor(private readonly repository: Salaryv2Repository) {
  }

  async createMany(body: CreateManySalaryv2Dto) {
    const salaries = body.payrollIds.map(payrollId => {
      return this.mapToSalary(Object.assign(body, {payrollId}));
    }) as SalaryEntity[];
    const {count} = await this.repository.createMany(salaries);
    return crudManyResponse(count, "creation");
  }

  async findAll() {
    return this.repository.findAll();
  }

  async count() {
    return this.repository.count();
  }

  async findOne(id: number) {
    return this.repository.findOne(id);
  }

  async updateMany(updates: UpdateManySalaryv2Dto) {
    const {count} = await this.repository.updateMany(updates.salaryIds, this.mapToSalary(updates));
    return crudManyResponse(count, "updation");
  }

  async removeMany(body: RemoteManySalaryv2Dto) {
    const {count} = await this.repository.removeMany(body);
    return crudManyResponse(count, "deletion");
  }

  private mapToSalary(body): UpdateSalaryv2Dto {
    return {
      payrollId: body.payrollId,
      title: body.title,
      type: body.type,
      price: body.price,
      blockId: body.type === SalaryType.STAY ? body?.blockId || 2 : body?.blockId || 1,
      note: body.note,
    } as UpdateSalaryv2Dto;
  }
}
