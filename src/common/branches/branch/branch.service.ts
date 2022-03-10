import {Injectable} from "@nestjs/common";
import {CreateBranchDto} from "./dto/create-branch.dto";
import {Branch} from "@prisma/client";
import {BranchRepository} from "./branch.repository";
import {UpdateBranchDto} from "./dto/update-branch.dto";
import {ProfileEntity} from "../../entities/profile.entity";

@Injectable()
export class BranchService {
  constructor(private readonly repository: BranchRepository) {
  }

  async create(profile: ProfileEntity, body: CreateBranchDto): Promise<Branch> {
    return await this.repository.create(profile, body);
  }

  async findAll(profile: ProfileEntity) {
    return await this.repository.findAll(profile);
  }

  async findOne(profile: ProfileEntity, id: number) {
    return await this.repository.findOne(profile, id);
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
