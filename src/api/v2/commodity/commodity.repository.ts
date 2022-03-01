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
      const commodity = await this.prisma.commodity.findUnique({where: {id}});

      const updated = await this.prisma.commodity.update({
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
      if (updates.histored) {
        const updownBuy = updated?.amount
          ? updated.amount > commodity.amount
            ? `Tăng thêm ${updated.amount - commodity.amount} con (gà mua)`
            : updated.amount < commodity.amount
              ? `Giảm đi ${commodity.amount - updated.amount} con (gà mua)`
              : null
          : null;
        const updownGift = updated?.gift
          ? updated.gift > commodity.gift
            ? `Tăng thêm ${updated.gift - commodity.gift} con (gà tặng)`
            : updated.gift < commodity.gift
              ? `Giảm đi ${commodity.gift - updated.gift} con (gà tặng)`
              : null
          : null;
        const updownMore = updated?.more
          ? updated.more > commodity.more
            ? `Tăng thêm ${updated.more - commodity.more} con (mua thêm)`
            : updated.more < commodity.more
              ? `Giảm đi ${commodity.more - updated.more} con (mua thêm)`
              : null
          : null;

        if (updownBuy || updownGift || updownMore) {
          await this.prisma.orderHistory.create({
            data: {
              order: {connect: {id: commodity?.orderId}},
              type: commodity.name,
              note: updownBuy ? updownBuy : '' + updownGift + '. ' ? updownGift + '. ' : '' + updownMore ? updownMore : '',
            }
          });
        }
      }
      return updated;
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
