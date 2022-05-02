import {BadRequestException, Injectable} from "@nestjs/common";
import {AllowanceSalary} from "@prisma/client";
import {BaseRepository} from "../../../../common/repository/base.repository";
import {PrismaService} from "../../../../prisma.service";
import {CreateAllowanceDto} from "./dto/create-allowance.dto";
import {UpdateAllowanceDto} from "./dto/update-allowance.dto";
import {RemoveManyAllowanceDto} from "./dto/remove-many-allowance.dto";
import {CreateManyAllowanceDto} from "./dto/create-many-allowance.dto";

@Injectable()
export class AllowanceRepository extends BaseRepository<AllowanceSalary, any> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(body: CreateAllowanceDto) {
    try {
      return await this.prisma.allowanceSalary.createMany({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async createMany(body: CreateAllowanceDto[]) {
    try {
      return await this.prisma.allowanceSalary.createMany({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  findAll() {
    try {
      return 'This action adds a new allowance';
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  findOne(id: number) {
    try {
      return 'This action adds a new allowance';
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async updateMany(ids: number[], body: CreateAllowanceDto) {
    try {
      return await this.prisma.allowanceSalary.updateMany({
        where: {id: {in: ids}},
        data: body,
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(body: RemoveManyAllowanceDto) {
    try {
      return await this.prisma.allowanceSalary.deleteMany({
        where: {id: {in: body.salaryIds}}
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
