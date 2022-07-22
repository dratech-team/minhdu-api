import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateOrderHistoryDto} from './dto/create-order-history.dto';
import {UpdateOrderHistoryDto} from './dto/update-order-history.dto';
import {PrismaService} from "../../../../prisma.service";
import {SearchOrderHistoryDto} from "./dto/search-order-history.dto";
import {ProfileEntity} from "../../../../common/entities/profile.entity";

@Injectable()
export class OrderHistoryService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateOrderHistoryDto) {
    try {
      return await this.prisma.orderHistory.create({
        data: {
          commodity: {connect: {id: body.commodityId}},
          amount: body.amount,
          gift: body.gift,
          more: body.more,
          price: body.price,
          confirmedAt: body.confirmedAt,
          note: body.note
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(search: SearchOrderHistoryDto) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.orderHistory.count({
          where: {
            commodity: {
              name: {startsWith: search?.commodity, mode: "insensitive"},
              order: search?.orderId ? {id: {in: search.orderId}} : {},
            },
            deletedAt: {in: null}
          }
        }),
        this.prisma.orderHistory.findMany({
          take: search?.take,
          skip: search?.skip,
          where: {
            commodity: {
              name: {startsWith: search?.commodity, mode: "insensitive"},
              order: search?.orderId ? {id: {in: search.orderId}} : {},
            },
            deletedAt: {in: null}
          },
          include: {commodity: true},
          orderBy: {timestamp: "desc"}
        }),
      ]);
      return {total, data};
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    return `This action returns a #${id} orderHistory`;
  }

  async update(id: number, updateOrderHistoryDto: UpdateOrderHistoryDto) {
    return `This action updates a #${id} orderHistory`;
  }

  async remove(id: number, profile: ProfileEntity) {
    try {
      const account = await this.prisma.account.findUnique({where: {id: profile.id}});
      return await this.prisma.orderHistory.update({
        where: {id},
        data: {
          deletedAt: new Date(),
          deletedBy: account.username + `(${account.ip})`,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
