import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateSalaryDto} from "./dto/create-salary.dto";
import {UpdateSalaryDto} from "./dto/update-salary.dto";

@Injectable()
export class SalaryRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateSalaryDto) {
    try {
      return await this.prisma.salary.create({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findMany(body: CreateSalaryDto) {
    return await this.prisma.salary.findFirst({where: body});
  }

  async findOne(id: number) {
    return this.prisma.salary.findUnique({where: {id}});
  }

  async update(id: number, updateSalaryDto: UpdateSalaryDto) {
    return this.prisma.salary.update({
      where: {id: id},
      data: updateSalaryDto
    }).catch((err) => {
      console.error(err);
      throw new BadRequestException(err);
    });
  }

  async remove(id: number) {
    this.prisma.salary.delete({where: {id: id}}).catch(err => {
      console.error(err);
      throw new BadRequestException(err);
    });
  }
}
