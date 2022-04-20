import {AbsentSalary} from "@prisma/client";
import {BaseRepository} from "../../../../common/repository/base.repository";
import {PrismaService} from "../../../../prisma.service";
import {UpdateAbsentDto} from "./dto/update-absent.dto";
import {BadRequestException} from "@nestjs/common";
import {SalaryEntity} from "../salaryv2/entities/salary.entity";

export class AbsentRepository extends BaseRepository<AbsentSalary, any> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async createMany(body: AbsentSalary[]) {
    try {
      return await this.prisma.absentSalary.createMany({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    return `This action returns all absent`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} absent`;
  }

  async update(ids: number[], body: Partial<AbsentSalary>) {
    try {
      return await this.prisma.absentSalary.updateMany({
        where: {id: {in: ids}},
        data: body
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async removeMany(ids: number[]) {
    try {
      return await this.prisma.absentSalary.deleteMany({
        where: {id: {in: ids}},
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
