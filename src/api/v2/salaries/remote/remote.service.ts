import {Injectable} from '@nestjs/common';
import {RemoteSalary} from '@prisma/client';
import {CreateRemoteDto} from './dto/create-remote.dto';
import {UpdateRemoteDto} from './dto/update-remote.dto';
import {RemoteRepository} from "./remote.repository";

@Injectable()
export class RemoteService {
  constructor(private readonly repository: RemoteRepository) {
  }

  create(body: CreateRemoteDto) {
    return this.repository.create(this.mapToRemote(body));
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  update(id: number, body: UpdateRemoteDto) {
    return this.repository.update(id, this.mapToRemote(body));
  }

  remove(id: number) {
    return this.repository.remove(id);
  }

  private mapToRemote(body: CreateRemoteDto | UpdateRemoteDto): Omit<RemoteSalary, "id"> {
    return {
      type: body.type,
      startedAt: body.startedAt,
      endedAt: body.endedAt,
      payrollId: body.payrollId,
      note: body.note
    };
  }
}
