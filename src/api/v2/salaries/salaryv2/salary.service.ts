import {Injectable} from '@nestjs/common';
import {UpdateSalaryDto} from './dto/update-salary.dto';
import {SalaryRepository} from "./salary.repository";
import {SalaryEntity} from "./entities/salary.entity";
import {crudManyResponse} from "../../../v1/salaries/base/functions/response.function";
import {SalaryType} from "@prisma/client";
import {CreateManySalaryDto} from "./dto/create-many-salary.dto";
import {UpdateManySalaryDto} from "./dto/update-many-salary.dto";
import {RemoteManySalaryDto} from "./dto/remote-many-salary.dto";

@Injectable()
export class SalaryService {
  constructor(private readonly repository: SalaryRepository) {
  }

  async createMany(body: CreateManySalaryDto) {
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

  async updateMany(updates: UpdateManySalaryDto) {
    const {count} = await this.repository.updateMany(updates.salaryIds, this.mapToSalary(updates));
    return crudManyResponse(count, "updation");
  }

  async removeMany(body: RemoteManySalaryDto) {
    const {count} = await this.repository.removeMany(body);
    return crudManyResponse(count, "deletion");
  }

  private mapToSalary(body): UpdateSalaryDto {
    return {
      payrollId: body.payrollId,
      title: body.title,
      type: body.type,
      price: body.price,
      blockId: body.type === SalaryType.STAY ? body?.blockId || 2 : body?.blockId || 1,
      note: body.note,
    } as UpdateSalaryDto;
  }
}
