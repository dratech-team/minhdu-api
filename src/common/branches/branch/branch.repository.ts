import {BadRequestException, Injectable,} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateBranchDto} from "./dto/create-branch.dto";
import {Branch} from "@prisma/client";
import {UpdateBranchDto} from "./dto/update-branch.dto";
import {ResponsePagination} from "../../entities/response.pagination";

@Injectable()
export class BranchRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateBranchDto): Promise<Branch> {
    try {
      return await this.prisma.branch.create({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(): Promise<Branch[]> {
    try {
      return await this.prisma.branch.findMany({
        include: {
          _count: true,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findMany(search: CreateBranchDto): Promise<Branch[]> {
    try {
      return await this.prisma.branch.findMany({
        where: {
          name: search.name,
        },
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
    return this.prisma.branch
      .update({where: {id: id}, data: updates})
      .catch((e) => new BadRequestException(e));
  }

  async remove(id: number) {
    try {
      return await this.prisma.branch.delete({where: {id: id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
