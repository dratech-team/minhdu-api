import {Injectable} from "@nestjs/common";
import {BaseRepository} from "../../../../common/repository/base.repository";
import {HolidayEntity} from "./entities/holiday.entity";
import {PrismaService} from "../../../../prisma.service";
import {InterfaceRepository} from "../../../../common/repository/interface.repository";
import {ResponsePagination} from "../../../../common/entities/response.pagination";
import {CreateHolidayDto} from "./dto/create-holiday.dto";
import {UpdateHolidayDto} from "./dto/update-holiday.dto";
import {RemoveManyHolidayDto} from "./dto/remove-many-holiday.dto";

@Injectable()
export class HolidayRepository extends BaseRepository<HolidayEntity> implements InterfaceRepository<HolidayEntity> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(body: CreateHolidayDto): Promise<HolidayEntity> {
    return await this.prisma.holidaySalary.create({data: body});
  }

  async createMany(body: Array<CreateHolidayDto>): Promise<{ count: number }> {
    return await this.prisma.holidaySalary.createMany({data: body});
  }

  async findAll(search?: any): Promise<ResponsePagination<HolidayEntity>> {
    return Promise.resolve(undefined);
  }

  async findOne(id: number): Promise<HolidayEntity> {
    return Promise.resolve(undefined);
  }

  async update(id: number, updates: UpdateHolidayDto): Promise<HolidayEntity> {
    return await this.prisma.holidaySalary.update({
      where: {id},
      data: updates,
    });
  }

  async updateMany(ids: number[], updates: UpdateHolidayDto): Promise<{ count: number }> {
    return await this.prisma.holidaySalary.updateMany({
      where: {id: {in: ids}},
      data: updates,
    });
  }

  async remove(id: number): Promise<HolidayEntity> {
    return await this.prisma.holidaySalary.delete({where: {id}});
  }

  async removeMany(body: RemoveManyHolidayDto): Promise<{ count: number }> {
    return await this.prisma.holidaySalary.deleteMany({where: {id: {in: body.salaryIds}},});
  }

}
