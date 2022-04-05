import {BadRequestException, Injectable} from '@nestjs/common';
import {PrismaService} from "../../../../prisma.service";
import {CreateSalaryHistoryDto} from "./dto/create-salary-history.dto";
import {UpdateSalaryHistoryDto} from "./dto/update-salary-history.dto";

@Injectable()
export class SalaryHistoryService {
  constructor(private prisma: PrismaService) {
  }

  async create(body: CreateSalaryHistoryDto) {
    return 'This action adds a new salary';
  }

  async findAll() {
    return `This action returns all salary`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} salary`;
  }

  async update(id: number, updates: UpdateSalaryHistoryDto) {
    try {
      console.log(updates)
      return await this.prisma.salaryHistory.update({
        where: {id},
        data: {
          title: updates?.title,
          price: updates?.price,
          createdAt: updates?.createdAt,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.salaryHistory.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
