import {Injectable} from '@nestjs/common';
import {UpdateSalaryDto} from './dto/update-salary.dto';
import {CreateSalaryDto} from "./dto/create-salary.dto";
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class SalaryService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(createSalaryDto: CreateSalaryDto) {
    return await this.prisma.salary.create({data: createSalaryDto });
  }

  findAll() {
    return `This action returns all salary`;
  }

  async findOne(id: number) {

  }

  async update(id: number, updateSalaryDto: UpdateSalaryDto) {
    return this.prisma.salary.update({
      where: {id: id},
      data: updateSalaryDto
    });
  }

  remove(id: number) {
    return `This action removes a #${id} salary`;
  }
}
