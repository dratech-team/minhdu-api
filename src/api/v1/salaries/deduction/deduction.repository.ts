import {PrismaService} from "../../../../prisma.service";
import {BadRequestException, Injectable} from "@nestjs/common";
import {CreateDeductionDto, RemoveManyDeductionDto} from "./dto";

@Injectable()
export class DeductionRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async createMany(body: CreateDeductionDto[]) {
    try {
      return await this.prisma.deductionSalary.createMany({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      return await this.prisma.deductionSalary.findMany();
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async count() {
    try {
      return await this.prisma.deductionSalary.count();
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.deductionSalary.findUnique({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async updateMany(ids: number[], body: CreateDeductionDto) {
    try {
      return await this.prisma.deductionSalary.updateMany({where: {id: {in: ids}}, data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async removeMany(body: RemoveManyDeductionDto) {
    try {
      return await this.prisma.deductionSalary.deleteMany({where: {id: {in: body.salaryIds}}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
