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
    if (!(await this.findBy(body)).length) {
      return await this.repository.create(body);
    }
  }

  async findAll() {
    const branches = await this.repository.findAll();
    return await Promise.all(
      branches.map(async branch => Object.assign(branch, Object.assign(branch._count, {employeeLeft: await this.repository.count(branch.id, true)})))
    );
  }

  async findBy(query: CreateBranchDto): Promise<Branch[]> {
    return await this.repository.findMany(query);
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

  removeAlowance(id: number) {
    return this.repository.removeAlowance(id);
  }

  generateCode(input: string): string {
    // Xoa dau cach thua VA xoa Unico
    input.trim();
    input.replace(/\s+/g, " ");

    // Tach cac ki tu dau tien
    let x = input.split(" ");
    let kq = "";
    for (let i = x.length - 1; i >= 0; i--) {
      kq = x[i].charAt(0) + kq;
    }

    // Xoa ki tu them
    while (kq.length <= 2) kq += "1";
    if (kq.length > 3) kq = kq.slice(kq.length - 3);
    // Xoa dau
    kq = kq
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
    return kq.toUpperCase();
  }
}
