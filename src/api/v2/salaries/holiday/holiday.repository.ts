import {BadRequestException, Injectable} from "@nestjs/common";
import {BaseRepository} from "../../../../common/repository/base.repository";
import {HolidayEntity} from "./entities/holiday.entity";
import {PrismaService} from "../../../../prisma.service";
import {ResponsePagination} from "../../../../common/entities/response.pagination";
import {CreateHolidayDto} from "./dto/create-holiday.dto";
import {UpdateHolidayDto} from "./dto/update-holiday.dto";
import {RemoveManyHolidayDto} from "./dto/remove-many-holiday.dto";

@Injectable()
export class HolidayRepository extends BaseRepository<HolidayEntity> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(body: CreateHolidayDto) {
    try {
      return await this.prisma.holidaySalary.create({
        data: {
          payrollId: body.payrollId,
          settingId: body.settingId,
          blockId: body.blockId,
          note: body.note,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async createMany(body: Array<CreateHolidayDto>): Promise<{ count: number }> {
    try {
      return await this.prisma.holidaySalary.createMany({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(search?: any): Promise<ResponsePagination<HolidayEntity>> {
    return Promise.resolve(undefined);
  }

  async count() {
    try {
      return await this.prisma.holidaySalary.count();
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number): Promise<HolidayEntity> {
    return Promise.resolve(undefined);
  }

  async update(id: number, updates: UpdateHolidayDto) {
    try {
      return await this.prisma.holidaySalary.update({
        where: {id},
        data: {
          payrollId: updates.payrollId,
          settingId: updates.settingId,
          blockId: updates.blockId,
          note: updates.note,
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async updateMany(ids: number[], updates: UpdateHolidayDto): Promise<{ count: number }> {
    try {
      return await this.prisma.holidaySalary.updateMany({
        where: {id: {in: ids}},
        data: updates,
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.holidaySalary.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async removeMany(body: RemoveManyHolidayDto): Promise<{ count: number }> {
    try {
      return await this.prisma.holidaySalary.deleteMany({where: {id: {in: body.salaryIds}}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

}
