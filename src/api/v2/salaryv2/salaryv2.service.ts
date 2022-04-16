import {Injectable} from '@nestjs/common';
import {CreateSalaryv2Dto} from './dto/create-salaryv2.dto';
import {UpdateSalaryv2Dto} from './dto/update-salaryv2.dto';
import {Salaryv2Repository} from "./salaryv2.repository";
import {SalaryType} from "@prisma/client";
import {validateOrReject} from "class-validator";
import {rangeDatetime} from "../../../utils/datetime.util";

@Injectable()
export class Salaryv2Service {
  constructor(private readonly repository: Salaryv2Repository) {
  }

  async create(body: CreateSalaryv2Dto) {
    if (body.type === SalaryType.ABSENT || body.type === SalaryType.OVERTIME) {
      await validateOrReject(body, {
        groups: ['absent', 'overtime'],
      });
    }

    return await Promise.all(body.payrollIds.map(async payrollId => {
      return await this.repository.create(Object.assign(body, {
        payrollId: payrollId,
      }));
    }));
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    return this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateSalaryv2Dto) {
    return this.repository.update(id, updates);
  }

  async remove(id: number) {
    return this.repository.remove(id);
  }
}
