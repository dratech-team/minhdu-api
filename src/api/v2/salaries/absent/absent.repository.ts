import {AbsentSalary} from "@prisma/client";
import {BaseRepository} from "../../../../common/repository/base.repository";
import {PrismaService} from "../../../../prisma.service";
import {BadRequestException} from "@nestjs/common";
import {DeleteMultipleAbsentDto} from "./dto/delete-multiple-absent.dto";

export class AbsentRepository extends BaseRepository<AbsentSalary, any> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async createMany(body: AbsentSalary[]) {
    try {
      console.log(body)
      return await this.prisma.absentSalary.createMany({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      return await this.prisma.absentSalary.findMany();
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
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

  async removeMany(body: DeleteMultipleAbsentDto) {
    try {
      return await this.prisma.absentSalary.deleteMany({
        where: {id: {in: body.salaryIds}},
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
