import {Injectable} from '@nestjs/common';
import {CreateSalaryv2Dto} from './dto/create-salaryv2.dto';
import {UpdateSalaryv2Dto} from './dto/update-salaryv2.dto';
import {Salaryv2Repository} from "./salaryv2.repository";
import {SalaryEntity} from "./entities/salary.entity";
import {crudManyResponse} from "../base/functions/response.function";

@Injectable()
export class Salaryv2Service {
  constructor(private readonly repository: Salaryv2Repository) {
  }

  async createMany(body: CreateSalaryv2Dto) {
    const salaries = body.payrollIds.map(payrollId => {
      return this.mapToSalary(Object.assign(body, {payrollId}));
    }) as SalaryEntity[];
    const {count} = await this.repository.createMany(salaries);
    return crudManyResponse(count, "creation");
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    return this.repository.findOne(id);
  }

  async updateMany(updates: UpdateSalaryv2Dto) {
    const {count} = await this.repository.updateMany(updates.salaryIds, this.mapToSalary(updates));
    return crudManyResponse(count, "updation");
  }

  async removeMany(salaryIds: number[]) {
    const {count} = await this.repository.removeMany(salaryIds);
    return crudManyResponse(count, "deletion");
  }

  private mapToSalary(body): SalaryEntity {
    return {
      payrollId: body.payrollId,
      title: body.title,
      type: body.type,
      price: body.price,
      note: body.note,
    } as SalaryEntity;
  }
}
