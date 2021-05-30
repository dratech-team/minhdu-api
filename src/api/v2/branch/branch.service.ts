import {BadRequestException, ConflictException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {CreateBranchDto} from './dto/create-branch.dto';
import {UpdateBranchDto} from './dto/update-branch.dto';
import {PrismaService} from "../../../prisma.service";
import {Branch} from '@prisma/client';

@Injectable()
export class BranchService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateBranchDto): Promise<Branch> {
    const id = this.generateNameCode(body.name);

    try {
      return await this.prisma.branch.create({
        data: {
          id: id,
          name: body.name,
        }
      });
    } catch (e) {
      if (e?.code == "P2002") {
        throw new ConflictException('Tên chi nhánh không được phép trùng nhau. Vui lòng thử lại');
      } else {
        throw new BadRequestException(e);
      }
    }
  }

  async findAll(): Promise<any> {
    let branches = [];

    try {
      const res = await this.prisma.branch.findMany({
        select: {
          id: true,
          name: true,
          departments: {
            select: {
              id: true,
              positions: {select: {id: true}}
            }
          },
        }
      });
      res.map(branch => branches.push({
        id: branch.id,
        name: branch.name,
        departmentIds: branch.departments.map(e => e.id)
      }));
      return branches;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(`Các tham số skip, take, id là bắt buộc. Vui lòng kiểm tra lại bạn đã truyền đủ 3 tham số chưa.?`);
    }

  }

  findOne(id: string) {
    return this.prisma.branch.findUnique({where: {id: id}});
  }

  async update(id: string, updates: UpdateBranchDto) {
    return await this.prisma.branch.update({where: {id: id}, data: updates}).catch((e) => new BadRequestException(e));
  }

  async remove(id: string): Promise<void> {
    await this.prisma.branch.delete({where: {id: id}}).catch((e) => {
      throw new BadRequestException(e);
    });
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
