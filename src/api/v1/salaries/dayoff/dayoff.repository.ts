import {BadRequestException, Injectable} from "@nestjs/common";
import {BaseRepository} from "../../../../common/repository/base.repository";
import {PrismaService} from "../../../../prisma.service";
import {DayoffEnity} from "./entities/dayoff.entity";
import {CreateDayoffDto} from "./dto/create-dayoff.dto";
import {UpdateDayoffDto} from "./dto/update-dayoff.dto";
import {RemoveManyDayoffDto} from "./dto/remove-many-dayoff.dto";

@Injectable()
export class DayoffRepository extends BaseRepository<DayoffEnity> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(body: CreateDayoffDto) {
    try {
      return await this.prisma.dayOffSalary.create({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async createMany(body: CreateDayoffDto[]) {
    try {
      return await this.prisma.dayOffSalary.createMany({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      const [total, data] = await Promise.all([
        this.prisma.dayOffSalary.count(),
        this.prisma.dayOffSalary.findMany(),
      ]);
      return {total, data};
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async count() {
    try {
      return await this.prisma.dayOffSalary.count();
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.dayOffSalary.findUnique({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, update: UpdateDayoffDto) {
    try {
      return await this.prisma.dayOffSalary.update({
        where: {id},
        data: update,
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async updateMany(ids: number[], update: UpdateDayoffDto) {
    try {
      return await this.prisma.dayOffSalary.updateMany({
        where: {id: {in: ids}},
        data: update,
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.dayOffSalary.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async removeMany(body: RemoveManyDayoffDto) {
    try {
      return await this.prisma.dayOffSalary.deleteMany({where: {id: {in: body.salaryIds}}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
