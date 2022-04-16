import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {SalaryEntity} from "./entities/salary.entity";

@Injectable()
export class Salaryv2Repository {
  constructor(private readonly prisma: PrismaService) {
  }

  async createMany(bodys: SalaryEntity[]) {
    try {
      return await this.prisma.salaryv2.createMany({data: bodys});
    } catch (err) {
      if (err.code === "P2002") {
        throw new BadRequestException("Buổi, từ ngày, đến ngày là duy nhất. không được trùng");
      }
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      return 'This action adds a new salaryv2';
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.salaryv2.findUnique({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async updateMany(ids: number[], update: Partial<SalaryEntity>) {
    try {
      return await this.prisma.salaryv2.updateMany({
        where: {id: {in: ids}},
        data: update
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.salaryv2.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  private async validateDuplicate() {

  }
}
