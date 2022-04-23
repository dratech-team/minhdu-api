import {Injectable} from '@nestjs/common';
import {CreateAbsentDto} from './dto/create-absent.dto';
import {UpdateAbsentDto} from './dto/update-absent.dto';
import {AbsentRepository} from "./absent.repository";
import {AbsentSalary} from '@prisma/client';
import {DeleteMultipleAbsentDto} from "./dto/delete-multiple-absent.dto";

@Injectable()
export class AbsentService {
  constructor(private readonly repository: AbsentRepository) {
  }

  async createMany(body: CreateAbsentDto) {
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

  async updateMany(body: UpdateAbsentDto) {
    const {count} = await this.repository.update(body.payrollIds, this.mapToAbsent(body));
    return {status: 201, message: `Cập nhật thành công ${count} record`};
  }

  async removeMany(body: DeleteMultipleAbsentDto) {
    const {count} = await this.repository.removeMany(body);
    return {status: 201, message: `Đã xóa thành công ${count} record`};
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
