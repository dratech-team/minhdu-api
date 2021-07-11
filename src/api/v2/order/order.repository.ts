import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateOrderDto} from "./dto/create-order.dto";
import {UpdateOrderDto} from "./dto/update-order.dto";

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateOrderDto) {
    try {
      return await this.prisma.order.create({
        data: {
          customerId: body.customerId,
          createdAt: body.createdAt,
          explain: body.explain,
          currency: body.currency,
          commodities: {
            connect: body.commodityIds.map(id => ({id}))
          }
        }
      });
    } catch (err) {
      console.error('order create', err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.order.findUnique({
        where: {id},
        include: {
          commodities: true,
          customer: true,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      const [total, data] = await Promise.all([
        this.prisma.order.count(),
        this.prisma.order.findMany({
          include: {commodities: true, customer: true}
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

  async update(id: number, updates: UpdateOrderDto) {
    try {
      return await this.prisma.order.update({
        where: {id},
        data: {
          customerId: updates.customerId,
          createdAt: updates.createdAt,
          explain: updates.explain,
          payType: updates.payType,
          paidAt: (!updates.paidAt && updates.paidTotal) ? new Date() : updates.paidAt,
          currency: updates.currency,
          paidTotal: updates.paidTotal,
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.order.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
