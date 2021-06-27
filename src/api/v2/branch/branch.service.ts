import {Injectable} from '@nestjs/common';
import {CreateBranchDto} from './dto/create-branch.dto';
import {Branch} from '@prisma/client';
import {BranchRepository} from "./branch.repository";
import {UpdateBranchDto} from "./dto/update-branch.dto";
import {BaseBranchService} from "./base-branch.service";

@Injectable()
export class BranchService implements BaseBranchService {
  constructor(private readonly repository: BranchRepository) {
  }

  async create(body: CreateBranchDto): Promise<Branch> {
    body.code = this.generateCode(body.name);

    return await this.repository.create(body);
  }

  async findAll(): Promise<any> {
    const branches = await this.repository.findAll();
    return branches.map(branch => {
      return {
        id: branch.id,
        name: branch.name,
        departmentIds: branch.departments.map(department => department.id),
      };
    });
  }

  findBy(query: any): Promise<[]> {
    return Promise.resolve([]);
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  update(id: number, updates: UpdateBranchDto): Promise<any> {
    return this.repository.update(id, updates);
  }

  remove(id: number) {
    return this.repository.remove(id);
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
    kq = kq.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    return kq.toUpperCase();
  }
}
