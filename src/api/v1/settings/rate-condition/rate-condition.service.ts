import {Injectable} from '@nestjs/common';
import {CreateRateConditionDto} from './dto/create-rate-condition.dto';
import {UpdateRateConditionDto} from './dto/update-rate-condition.dto';
import {PrismaService} from "../../../../prisma.service";
import {SearchRateConditionDto} from "./dto/search-rate-condition.dto";

@Injectable()
export class RateConditionService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateRateConditionDto) {
    try {
      return await this.prisma.rateCondition.create({data: body});
    } catch (err) {
      console.error(err);
    }
  }

  async findAll(search: Partial<SearchRateConditionDto>) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.rateCondition.count(),
        this.prisma.rateCondition.findMany({
          take: search?.take,
          skip: search?.skip,
        })
      ]);
      return {total, data};
    } catch (err) {
      console.error(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.rateCondition.findUnique({where: {id}});
    } catch (err) {
      console.error(err);
    }
  }

  async update(id: number, update: UpdateRateConditionDto) {
    try {
      return await this.prisma.rateCondition.update({
        where: {id},
        data: update,
      });
    } catch (err) {
      console.error(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.rateCondition.delete({where: {id}});
    } catch (err) {
      console.error(err);
    }
  }
}
