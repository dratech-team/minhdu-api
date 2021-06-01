import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateBranchDto} from "./dto/create-branch.dto";
import {Branch} from "@prisma/client";
import {UpdateBranchDto} from "./dto/update-branch.dto";

@Injectable()
export class BranchRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateBranchDto): Promise<Branch> {
    return await this.prisma.branch.create({data: body});
  }

  async findAll(): Promise<any> {
    return await this.prisma.branch.findMany({
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
  }

  async findOne(id: number) {
    return await this.prisma.branch.findUnique({where: {id: id}}).catch(e => new BadRequestException(e));
  }

  async update(id: number, updates: UpdateBranchDto) {
    return await this.prisma.branch.update({where: {id: id}, data: updates}).catch((e) => new BadRequestException(e));
  }

  remove(id: number): void {
    this.prisma.branch.delete({where: {id: id}}).catch(e => new BadRequestException(e));
  }

  async changeCode(id: number, code: string) {
    return await this.prisma.branch.update({
      where: {id: id},
      data: {code: code + id}
    }).catch((e) => new BadRequestException(e));
  }
}
