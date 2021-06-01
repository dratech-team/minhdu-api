import {BadRequestException, ConflictException, Injectable} from '@nestjs/common';
import {CreateBranchDto} from './dto/create-branch.dto';
import {Branch} from '@prisma/client';
import {BranchRepository} from "./branch.repository";
import {UpdateBranchDto} from "./dto/update-branch.dto";

@Injectable()
export class BranchService {
  constructor(private readonly repository: BranchRepository) {
  }

  async create(body: CreateBranchDto): Promise<Branch> {
    const code = this.generateNameCode(body.name);

    try {
      const branch = await this.repository.create(body);
      this.repository.changeCode(branch.id, code).then();

      return branch;
    } catch (e) {
      console.error(e);
      if (e?.code == "P2002") {
        throw new ConflictException('Tên chi nhánh không được phép trùng nhau. Vui lòng thử lại');
      } else {
        throw new BadRequestException(e);
      }
    }
  }

  async findAll(): Promise<any> {
    try {
      const res = await this.repository.findAll();
      return res.map(branch => {
        return {
          id: branch.id,
          name: branch.name,
          departmentIds: branch.departments.map(e => e.id)
        };
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException(`Các tham số skip, take, id là bắt buộc. Vui lòng kiểm tra lại bạn đã truyền đủ 3 tham số chưa.?`);
    }
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  update(id: number, updates: UpdateBranchDto): Promise<any> {
    return this.repository.update(id, updates);
  }

  remove(id: number): void {
    this.repository.remove(id);
  }

  generateNameCode(str) {

    // Xoa dau cach thua VA xoa Unico
    str.trim();
    str.replace(/\s+/g, " ");

    // Tach cac ki tu dau tien
    let x = str.split(" ");
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
