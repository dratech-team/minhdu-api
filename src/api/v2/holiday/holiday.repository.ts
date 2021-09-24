import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma.service";
import { CreateHolidayDto } from "./dto/create-holiday.dto";
import { UpdateHolidayDto } from "./dto/update-holiday.dto";
import { SearchHolidayDto } from "./dto/search-holiday.dto";

@Injectable()
export class HolidayRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateHolidayDto) {
    try {
      return await this.prisma.holiday.create({ data: body });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(take: number, skip: number, search: Partial<SearchHolidayDto>) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.holiday.count(),
        this.prisma.holiday.findMany({
          take: take || undefined,
          skip: skip || undefined,
          where: {
            name: { startsWith: search?.name },
            datetime: search?.datetime || undefined,
            rate: search?.rate || undefined,
          },
          include: {
            position: true
          },
        }),
      ]);
      return { total, data };
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.holiday.findUnique({
        where: { id },
        include: {
          position: true,
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdateHolidayDto) {
    try {
      return await this.prisma.holiday.update({
        where: { id },
        data: updates,
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.holiday.delete({ where: { id } });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
