import {Injectable} from '@nestjs/common';
import {CreateRemoteDto, RemoveManyRemoteDto, UpdateRemoteDto} from './dto';
import {RemoteRepository} from "./remote.repository";
import {RemoteEntity} from "./entities/remote.entity";
import {crudManyResponse} from "../base/functions/response.function";
import {CreateManyRemoteDto} from "./dto/create-many-remote.dto";

@Injectable()
export class RemoteService {
  constructor(private readonly repository: RemoteRepository) {
  }

  async createMany(body: CreateManyRemoteDto) {
    const salaries = body.payrollIds.map(payrollId => {
      return this.mapToRemote(Object.assign(body, {payrollId}));
    }) as RemoteEntity[];

    const {count} = await this.repository.createMany(salaries);
    return crudManyResponse(count, "creation");
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  async update(id: number, body: UpdateRemoteDto) {
    const {count} = await this.repository.updateMany(body.salaryIds, this.mapToRemote(body));
    return crudManyResponse(count, "updation");
  }

  async removeMany(body: RemoveManyRemoteDto) {
    const {count} = await this.repository.removeMany(body);
    return crudManyResponse(count, "deletion");
  }

  private mapToRemote(body): CreateRemoteDto {
    return {
      type: body.type,
      startedAt: body.startedAt,
      endedAt: body.endedAt,
      payrollId: body.payrollId,
      blockId: body?.blockId || 7,
      note: body.note
    } as CreateRemoteDto;
  }
}
