import {BadRequestException, Injectable} from '@nestjs/common';
import {UpdateSalaryDto} from './dto/update-salary.dto';
import {CreateSalaryDto} from "./dto/create-salary.dto";
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class SalaryService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(createSalaryDto?: CreateSalaryDto) {
    createSalaryDto.datetime = new Date(createSalaryDto.datetime);
    try {
      const salary = await this.prisma.salary.findMany({
        where: {
          title: createSalaryDto.title,
          type: createSalaryDto.type,
          datetime: createSalaryDto.datetime,
          times: createSalaryDto.times,
          rate: createSalaryDto.rate,
          price: createSalaryDto.price,
          forgot: createSalaryDto.forgot,
          note: createSalaryDto.note,
        }
      });
      if (salary.length === 1) {
        return salary[0];
      } else {
        return await this.prisma.salary.create({data: createSalaryDto});
      }

    } catch (e) {
      console.error(e);
      throw  new BadRequestException(e);
    }

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

  async remove(id: number) {
    try {
      await this.prisma.salary.delete({where: {id: id}});
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }
}
