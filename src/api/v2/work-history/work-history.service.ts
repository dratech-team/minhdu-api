import {Injectable} from '@nestjs/common';
import {CreateWorkHistoryDto} from './dto/create-work-history.dto';
import {UpdateWorkHistoryDto} from './dto/update-work-history.dto';
import {BaseWorkHistoryService} from "./base-work-history.service";
import {WorkHistoryRepository} from "./work-history.repository";

@Injectable()
export class WorkHistoryService implements BaseWorkHistoryService {
  constructor(private readonly repository: WorkHistoryRepository) {
  }

  create(createWorkHistoryDto: CreateWorkHistoryDto) {
    return this.repository.create(createWorkHistoryDto);
  }

  findAll(id: number, skip: number, take: number, search?: string) {
    return this.repository.findAll(id, skip, take, search);
  }

  findBy(employeeId: number, search?: string): Promise<[]> {
    return Promise.resolve([]);
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  update(id: number, updateWorkHistoryDto: UpdateWorkHistoryDto) {
    return this.repository.update(id, updateWorkHistoryDto);
  }

  remove(id: number) {
    this.repository.remove(id);
  }
}
