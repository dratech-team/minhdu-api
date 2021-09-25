import { Injectable } from "@nestjs/common";
import { WorkHistoryRepository } from "./work-history.repository";

@Injectable()
export class WorkHistoryService {
  constructor(private readonly repository: WorkHistoryRepository) {}

  create(positionId: number, branchId: number, employeeId: number) {
    return this.repository.create(positionId, branchId,employeeId);
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

  remove(id: number) {
    this.repository.remove(id);
  }
}
