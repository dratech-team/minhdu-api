import {Injectable} from '@nestjs/common';
import {UpdateRemoteDto} from './dto/update-remote.dto';
import {RemoteRepository} from "./remote.repository";
import {CreateRemoteDto} from "./dto/create-remote.dto";
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

  remove(id: number) {
    return this.repository.remove(id);
  }

  private mapToRemote(body): RemoteEntity {
    return {
      type: body.type,
      startedAt: body.startedAt,
      endedAt: body.endedAt,
      payrollId: body.payrollId,
      note: body.note
    };
  }
}
