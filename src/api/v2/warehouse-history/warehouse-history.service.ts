import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "src/prisma.service";
import {CreateWarehouseHistoryDto} from "./dto/create-warehouse-history.dto";
import {UpdateWarehouseHistoryDto} from "./dto/update-warehouse-history.dto";
import {SearchWarehouseHistoryDto} from "./dto/search-warehouse-history.dto";
import {WarehouseHistoryType} from "@prisma/client";

@Injectable()
export class WarehouseHistoryService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateWarehouseHistoryDto) {
    return (await Promise.all(body.products.map(async (product) => {
      const found = await this.prisma.product.findUnique({where: {id: product.id}});
      if (found.amount !== product.amount) {
        return (await this.prisma.$transaction([
          this.prisma.product.update({
            where: {id: product.id},
            data: {
              amount: product.amount
            }
          }),
          this.prisma.warehouseHistory.create({
            data: {
              product: {connect: {id: product.id}},
              amount: product.amount,
              inventoryTotal: found.amount,
              type: WarehouseHistoryType.INVENTORY,
            }
          })
        ]))[0];
      }
    }))).filter(product => product);
  }

  async findAll(search: SearchWarehouseHistoryDto) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.warehouseHistory.count({
          where: {
            type: {in: search.type},
            product: search?.product ? {name: {contains: search?.product}} : {},
          }
        }),
        this.prisma.warehouseHistory.findMany({
          take: search?.take,
          skip: search?.skip,
          where: {
            type: {in: search.type},
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
