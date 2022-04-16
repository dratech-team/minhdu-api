import {Injectable} from '@nestjs/common';
import {CreateSalaryv2Dto} from './dto/create-salaryv2.dto';
import {UpdateSalaryv2Dto} from './dto/update-salaryv2.dto';
import {Salaryv2Repository} from "./salaryv2.repository";
import {PartialDay} from "@prisma/client";
import * as moment from "moment";
import {SalaryEntity} from "./entities/salary.entity";

@Injectable()
export class Salaryv2Service {
  constructor(private readonly repository: Salaryv2Repository) {
  }

  async createMany(body: CreateSalaryv2Dto) {
    const salaries = body.payrollIds.map(payrollId => {
      Object.assign(body, {payrollId}, body.partial !== PartialDay.CUSTOM ? {
        startedAt: this.setHHmmSS(body.startedAt, body.startTime),
        endedAt: this.setHHmmSS(body.endedAt, body.endTime)
      } : {});
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

  async update(updates: UpdateSalaryv2Dto) {
    const found = await this.findOne(updates.salaryIds[0]);
    updates = Object.assign(updates, updates.partial !== PartialDay.CUSTOM ? {
      startedAt: this.setHHmmSS(updates?.startedAt || found.startedAt, updates?.startTime || moment(updates?.startedAt).format("HH:mm:ss")),
      endedAt: this.setHHmmSS(updates?.endedAt || found.endedAt, updates?.endTime || moment(updates?.endedAt).format("HH:mm:ss"))
    } : {});
    const {count} = await this.repository.updateMany(updates.salaryIds, this.mapToSalary(updates));
    return {status: 201, message: `Cập nhật thành công ${count} record`};
  }

  async remove(id: number) {
    return this.repository.remove(id);
  }

  private setHHmmSS(datetime, hhmmss: string) {
    const [hhs, mms, sss] = hhmmss?.split(":")?.map(e => +e);
    return moment(datetime).hour(hhs).minute(mms).second(sss).toDate();
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
      note: body.note,
      unit: body.unit,
      settingId: body.settingId,
    };
  }
}
