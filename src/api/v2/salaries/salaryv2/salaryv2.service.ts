import {Injectable} from '@nestjs/common';
import {CreateSalaryv2Dto} from './dto/create-salaryv2.dto';
import {UpdateSalaryv2Dto} from './dto/update-salaryv2.dto';
import {Salaryv2Repository} from "./salaryv2.repository";
import {SalaryEntity} from "./entities/salary.entity";

@Injectable()
export class Salaryv2Service {
  constructor(private readonly repository: Salaryv2Repository) {
  }

  async createMany(body: CreateSalaryv2Dto) {
    const salaries = body.payrollIds.map(payrollId => {
      return this.mapToSalary(Object.assign(body, {payrollId}));
    }) as SalaryEntity[];

    const {count} = await this.repository.createMany(salaries);
    return {status: 201, message: `Đã tạo ${count} record`};
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    return this.repository.findOne(id);
  }

  async updateMany(updates: UpdateSalaryv2Dto) {
    const {count} = await this.repository.updateMany(updates.salaryIds, this.mapToSalary(updates));
    return {status: 201, message: `Cập nhật thành công ${count} record`};
  }

  async removeMany(salaryIds: number[]) {
    return this.repository.removeMany(salaryIds);
  }

  private mapToSalary(body): SalaryEntity {
    return {
      payrollId: body.payrollId,
      title: body.title,
      type: body.type,
      partial: body.partial,
      price: body.price,
      startedAt: body.startedAt,
      endedAt: body.endedAt,
      startTime: body.startTime,
      endTime: body.endTime,
      note: body.note,
      unit: body.unit,
      settingId: body.settingId,
    };
  }
}
