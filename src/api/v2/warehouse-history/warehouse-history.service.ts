import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "src/prisma.service";
import {CreateWarehouseHistoryDto} from "./dto/create-warehouse-history.dto";
import {UpdateWarehouseHistoryDto} from "./dto/update-warehouse-history.dto";
import {SearchWarehouseHistoryDto} from "./dto/search-warehouse-history.dto";

@Injectable()
export class WarehouseHistoryService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateWarehouseHistoryDto) {
    return "This action adds a new importExport";
  }

  async findAll(search: SearchWarehouseHistoryDto) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.warehouseHistory.count({
          where: {
            type: search?.type ? {in: search?.type} : {},
            product: search?.product ? {name: {contains: search?.product}} : {},
          }
        }),
        this.prisma.warehouseHistory.findMany({
          take: search?.take,
          skip: search?.skip,
          where: {
            type: search?.type ? {in: search?.type} : {},
            product: search?.product ? {name: {contains: search?.product}} : {},
          },
          include: {
            product: true
          }
        })
      ]);
      return {total, data};
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    return `This action returns a #${id} importExport`;
  }

  async update(id: number, updates: UpdateWarehouseHistoryDto) {
    return `This action updates a #${id} importExport`;
  }

  async remove(id: number) {
    return `This action removes a #${id} importExport`;
  }
}
