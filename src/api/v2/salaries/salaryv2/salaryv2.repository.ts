import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../../prisma.service";
import {SalaryEntity} from "./entities/salary.entity";
import {CreateSalaryv2Dto} from "./dto/create-salaryv2.dto";
import {RemoteManySalaryv2Dto} from "./dto/remote-many-salaryv2.dto";

@Injectable()
export class Salaryv2Repository {
  constructor(private readonly prisma: PrismaService) {
  }

  async createMany(bodys: CreateSalaryv2Dto[]) {
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

  async removeMany(body: RemoteManySalaryv2Dto) {
    try {
      return await this.prisma.salaryv2.deleteMany({where: {id: {in: body.salaryIds}}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  private async validateDuplicate() {

  }
}
