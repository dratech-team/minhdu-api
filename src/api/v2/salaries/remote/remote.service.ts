import {Injectable} from '@nestjs/common';
import {CreateRemoteDto, DeleteMultipleRemoteDto, UpdateRemoteDto} from './dto';
import {RemoteRepository} from "./remote.repository";
import {RemoteEntity} from "./entities/remote.entity";

@Injectable()
export class RemoteService {
  constructor(private readonly repository: RemoteRepository) {
  }

  async createMany(body: CreateRemoteDto) {
    const salaries = body.payrollIds.map(payrollId => {
      return this.mapToRemote(Object.assign(body, {payrollId}));
    }) as RemoteEntity[];

    const {count} = await this.repository.createMany(salaries);
    return {status: 201, message: `Đã tạo ${count} record`};
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  async update(id: number, body: UpdateRemoteDto) {
    const {count} = await this.repository.updateMany(body.salaryIds, this.mapToRemote(body));
    return {status: 201, message: `Cập nhật thành công ${count} record`};
  }

  removeMany(body: DeleteMultipleRemoteDto) {
    return this.repository.removeMany(body);
  }

  private mapToRemote(body): RemoteEntity {
    return {
      type: body.type,
      startedAt: body.startedAt,
      endedAt: body.endedAt,
      payrollId: body.payrollId,
      blockId: body.blockId,
      note: body.note
    };
  }
}
