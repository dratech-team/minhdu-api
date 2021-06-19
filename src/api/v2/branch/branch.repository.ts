import {BadRequestException, ConflictException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateBranchDto} from "./dto/create-branch.dto";
import {Branch} from "@prisma/client";
import {UpdateBranchDto} from "./dto/update-branch.dto";

@Injectable()
export class BranchRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateBranchDto): Promise<Branch> {
    try {
      return await this.prisma.branch.create({data: body});
    } catch (err) {
      console.error(err);
      if (err?.code == "P2002") {
        throw new ConflictException('Tên chi nhánh không được phép trùng nhau. Vui lòng thử lại');
      } else {
        throw new BadRequestException(err);
      }
    }
  }

  async findAll(): Promise<any> {
    try {
      return await this.prisma.branch.findMany({
        select: {
          id: true,
          name: true,
          departments: {
            select: {
              id: true
            }
          },
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number): Promise<Branch> {
    return await this.prisma.branch.findUnique({where: {id: id}});
  }

  async update(id: number, updates: UpdateBranchDto) {
    return this.prisma.branch.update({where: {id: id}, data: updates}).catch((e) => new BadRequestException(e));
  }

  remove(id: number): void {
    this.prisma.branch.delete({where: {id: id}}).catch(e => new BadRequestException(e));
  }
}
