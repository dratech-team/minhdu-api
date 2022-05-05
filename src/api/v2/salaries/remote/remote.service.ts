import {Injectable} from '@nestjs/common';
import {CreateRemoteDto, RemoveManyRemoteDto} from './dto';
import {RemoteRepository} from "./remote.repository";
import {crudManyResponse} from "../base/functions/response.function";
import {CreateManyRemoteDto} from "./dto/create-many-remote.dto";
import {UpdateManyRemoteDto} from "./dto/update-many-remote.dto";

@Injectable()
export class RemoteService {
  constructor(private readonly repository: RemoteRepository) {
  }

  async createMany(body: CreateManyRemoteDto) {
    const salaries = body.payrollIds.map(payrollId => {
      return this.mapToRemote(Object.assign(body, {payrollId}));
    }) as CreateRemoteDto[];

    const {count} = await this.repository.createMany(salaries);
    return crudManyResponse(count, "creation");
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  async update(body: UpdateManyRemoteDto) {
    const {count} = await this.repository.updateMany(body.salaryIds, this.mapToRemote(body));
    return crudManyResponse(count, "updation");
  }

  async removeMany(body: RemoveManyRemoteDto) {
    const {count} = await this.repository.removeMany(body);
    return crudManyResponse(count, "deletion");
  }

  private mapToRemote(body) {
    return {
      type: body.type,
      partial: body.partial,
      startedAt: body.startedAt,
      endedAt: body.endedAt,
      payrollId: body.payrollId,
      blockId: body?.blockId || 7,
      note: body.note
    };
  }
}
