import {Injectable} from '@nestjs/common';
import {CreateAbsentDto} from './dto/create-absent.dto';
import {UpdateAbsentDto} from './dto/update-absent.dto';
import {AbsentRepository} from "./absent.repository";
import {AbsentSalary} from '@prisma/client';

@Injectable()
export class AbsentService {
  constructor(private readonly repository: AbsentRepository) {
  }

  async create(body: CreateAbsentDto) {
    const salaries = body.payrollIds.map(payrollId => {
      return this.mapToAbsent(Object.assign(body, {payrollId}));
    }) as AbsentSalary[];
    const {count} = await this.repository.createMany(salaries);
    return {status: 201, message: `Đã tạo ${count} record`};
  }

  findAll() {
    return `This action returns all absent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} absent`;
  }

  async update(body: UpdateAbsentDto) {
    const {count} = await this.repository.update(body.salaryIds, this.mapToAbsent(body));
    return {status: 201, message: `Cập nhật thành công ${count} record`};
  }

  remove(id: number) {
    return `This action removes a #${id} absent`;
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
    } as Omit<AbsentSalary, "id">;
  }
}
