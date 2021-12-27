import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateCommodityDto} from "./dto/create-commodity.dto";
import {UpdateCommodityDto} from "./dto/update-commodity.dto";

@Injectable()
export class CommodityRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateCommodityDto) {
    try {
      return await this.prisma.commodity.create({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.commodity.findFirst({
        where: {
          id: id,
          order: null,
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(take: number, skip: number) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.commodity.count({
          where: {order: null}
        }),
        this.prisma.commodity.findMany({
          take: take || undefined,
          skip: skip || undefined,
          where: {order: null}
        }),
      ]);
      return {
        total, data
      };
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdateCommodityDto) {
    try {
      return await this.prisma.commodity.update({
        where: {id},
        data: updates,
      });
    } catch (err) {
      console.error('commodity update', err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      const found = await this.prisma.commodity.findUnique({where: {id}, select: {order: true}});
      if (found.order.deliveredAt) {
        throw new BadRequestException('Đơn hàng đã giao. không được phép xóa');
      }
      return await this.prisma.commodity.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
