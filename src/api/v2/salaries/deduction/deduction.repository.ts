import {PrismaService} from "../../../../prisma.service";
import {UpdateDeductionDto} from "./dto/update-deduction.dto";
import {BadRequestException} from "@nestjs/common";
import {DeductionSalary} from "@prisma/client";

export class DeductionRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: Omit<DeductionSalary, "id">) {
    try {
      return await this.prisma.deductionSalary.create({data: body});
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

  async findOne(id: number) {
    try {
      return await this.prisma.deductionSalary.findUnique({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, body: UpdateDeductionDto) {
    try {
      return await this.prisma.deductionSalary.update({where: {id}, data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.deductionSalary.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
