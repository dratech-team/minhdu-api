import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateSalaryDto} from "./dto/create-salary.dto";

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
}
