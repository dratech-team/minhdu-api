import {BadRequestException, Injectable} from "@nestjs/common";
import {BaseRepository} from "../../../../common/repository/base.repository";
import {BranchSalaryEntity} from "./entities";
import {PrismaService} from "../../../../prisma.service";
import {CreateBranchSalaryDto} from "./dto/create-branch.dto";
import {UpdateBranchSalaryDto} from "./dto/update-branch.dto";

@Injectable()
export class BranchRepository extends BaseRepository<BranchSalaryEntity> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(body: CreateBranchSalaryDto) {
    try {
      return await this.prisma.allowanceBranch.create({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      return await this.prisma.allowanceBranch.findMany();
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.allowanceBranch.findMany({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, body: UpdateBranchSalaryDto) {
    try {
      return await this.prisma.allowanceBranch.update({where: {id}, data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.allowanceBranch.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
