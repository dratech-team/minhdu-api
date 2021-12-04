import {Injectable} from "@nestjs/common";
import {CreateBranchDto} from "./dto/create-branch.dto";
import {Branch} from "@prisma/client";
import {BranchRepository} from "./branch.repository";
import {UpdateBranchDto} from "./dto/update-branch.dto";

@Injectable()
export class BranchService {
  constructor(private readonly repository: BranchRepository) {
  }

  async create(body: CreateBranchDto): Promise<Branch> {
    return await this.repository.create(body);
  }

  async findAll() {
    const branches = await this.repository.findAll();
    return await Promise.all(
      branches.map(async branch => Object.assign(branch, Object.assign(branch._count, {employeeLeft: await this.repository.count(branch.id, true)})))
    );
  }

  async findOne(id: number) {
    const employee = await this.repository.count(id, true);
    const branch = await this.repository.findOne(id);
    return Object.assign(branch, {_count: Object.assign(branch._count, {employeesLeft: employee})});
  }

  update(id: number, updates: UpdateBranchDto): Promise<any> {
    return this.repository.update(id, updates);
  }

  remove(id: number) {
    return this.repository.remove(id);
  }

  removeAllowance(id: number) {
    return this.repository.removeAlowance(id);
  }
}
