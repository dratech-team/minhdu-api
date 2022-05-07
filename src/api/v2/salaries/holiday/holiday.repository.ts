import {Injectable} from "@nestjs/common";
import {BaseRepository} from "../../../../common/repository/base.repository";
import {HolidayEntity} from "./entities/holiday.entity";
import {PrismaService} from "../../../../prisma.service";
import {InterfaceRepository} from "../../../../common/repository/interface.repository";
import {ResponsePagination} from "../../../../common/entities/response.pagination";

@Injectable()
export class HolidayRepository extends BaseRepository<HolidayEntity> implements InterfaceRepository<HolidayEntity> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(body: any): Promise<HolidayEntity> {
    return await this.prisma.holidaySalary.create({
      data: body
    });
  }

  async createMany(body: Array<any>): Promise<{ count: number }> {
    return Promise.resolve({count: 0});
  }

  async findAll(search?: any): Promise<ResponsePagination<HolidayEntity>> {
    return Promise.resolve(undefined);
  }

  async findOne(id: number): Promise<HolidayEntity> {
    return Promise.resolve(undefined);
  }

  async update(id: number, updates: any): Promise<HolidayEntity> {
    return Promise.resolve(undefined);
  }

  async updateMany(ids: number[], updates: any): Promise<{ count: number }> {
    return Promise.resolve({count: 0});
  }

  async remove(id: number): Promise<HolidayEntity> {
    return Promise.resolve(undefined);
  }

  async removeMany(ids: number[]): Promise<{ count: number }> {
    return Promise.resolve({count: 0});
  }

}
