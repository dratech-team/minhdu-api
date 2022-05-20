import {Injectable} from '@nestjs/common';
import {CreateBranchSalaryDto} from './dto/create-branch.dto';
import {UpdateBranchSalaryDto} from './dto/update-branch.dto';
import {BranchRepository} from "./branch.repository";

@Injectable()
export class BranchService {
  constructor(private readonly repository: BranchRepository) {
  }

  create(body: CreateBranchSalaryDto) {
    return this.repository.create(body);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  update(id: number, body: UpdateBranchSalaryDto) {
    return this.repository.update(id, body);
  }

  remove(id: number) {
    return this.repository.remove(id);
  }
}
