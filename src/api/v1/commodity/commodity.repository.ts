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
      if (body?.orderId) {
        const order = await this.prisma.order.findUnique({where: {id: body.orderId}});
        if (order.deliveredAt) {
          throw new BadRequestException("Đơn hàng đã được giao thành công. Không được phép sửa!!!");
        }
      }
      // for (let i = 0; i < 50; i++) {
      //   await this.prisma.commodity.create({
      //     data: {
      //       code: "MD" + i,
      //       name: "Gà loại " + i,
      //       amount: 100 + i,
      //       unit: "CON"
      //     }
      //   });
      // }
      return await this.prisma.commodity.create({
        data: {
          name: body.name,
          code: body.code,
          amount: body.amount,
          orderId: body?.orderId,
          price: body?.price,
          unit: body?.unit,
          more: body?.more,
          gift: body?.gift,
          closed: body?.closed,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findFirst(id: number) {
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

  async findOne(id: number) {
    try {
      return await this.prisma.commodity.findUnique({where: {id: id}});
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
      if (updates?.orderId) {
        const order = await this.prisma.order.findUnique({where: {id: updates.orderId}});
        if (order.deliveredAt) {
          throw new BadRequestException("Đơn hàng đã được giao thành công. Không được phép sửa!!!");
        }
      }
      return await this.prisma.commodity.update({
        where: {id},
        data: {
          name: updates?.name,
          code: updates?.code,
          amount: updates?.amount,
          more: updates?.more,
          gift: updates?.gift,
          price: updates?.price,
          closed: updates?.closed,
        },
      });
    } catch (err) {
      console.error('commodity update', err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      const found = await this.prisma.commodity.findUnique({where: {id}, select: {order: true}});
      if (found?.order?.deliveredAt) {
        throw new BadRequestException('Đơn hàng đã giao. không được phép xóa');
      }
      return await this.prisma.commodity.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
