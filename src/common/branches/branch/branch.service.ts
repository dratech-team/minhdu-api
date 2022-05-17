import {Injectable} from "@nestjs/common";
import {CreateBranchDto} from "./dto/create-branch.dto";
import {Branch} from "@prisma/client";
import {BranchRepository} from "./branch.repository";
import {UpdateBranchDto} from "./dto/update-branch.dto";
import {ProfileEntity} from "../../entities/profile.entity";
import {SearchBranchDto} from "./dto/search-branch.dto";

@Injectable()
export class BranchService {
  constructor(private readonly repository: BranchRepository) {
  }

  async create(profile: ProfileEntity, body: CreateBranchDto): Promise<Branch> {
    return await this.repository.create(profile, body);
  }

  async findAll(profile: ProfileEntity, search: SearchBranchDto) {
    return await this.repository.findAll(profile, search);
  }

  async findOne(profile: ProfileEntity, id: number) {
    const branch = await this.repository.findOne(profile, id);
    return Object.assign(branch, {allowances: branch.allowancesv2});
  }

  update(profile: ProfileEntity, id: number, updates: UpdateBranchDto): Promise<any> {
    return this.repository.update(profile, id, updates);
  }

  remove(id: number) {
    return this.repository.remove(id);
  }

  removeAllowance(id: number) {
    return this.repository.removeAlowance(id);
  }
}
