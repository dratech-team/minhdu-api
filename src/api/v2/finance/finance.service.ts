import {Injectable} from '@nestjs/common';
import {CreateFinanceDto} from './dto/create-finance.dto';
import {UpdateFinanceDto} from './dto/update-finance.dto';
import {PrismaService} from "../../../prisma.service";
import * as moment from "moment";

@Injectable()
export class FinanceService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateFinanceDto) {
    return await this.prisma.payroll.findMany({});
  }

  async findAll(year: Date) {
    return await this.prisma.payroll.aggregate({
      where: {
        createdAt: {
          gte: moment(year).clone().startOf('years').toDate(),
          lte: moment(year).clone().endOf('years').toDate(),
        }
      },
      _sum: {total: true}
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} finance`;
  }

  update(id: number, updateFinanceDto: UpdateFinanceDto) {
    return `This action updates a #${id} finance`;
  }

  remove(id: number) {
    return `This action removes a #${id} finance`;
  }
}
