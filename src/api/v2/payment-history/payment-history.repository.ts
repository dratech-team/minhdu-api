import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreatePaymentHistoryDto} from "./dto/create-payment-history.dto";
import {UpdatePaymentHistoryDto} from "./dto/update-payment-history.dto";

@Injectable()
export class PaymentHistoryRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(customerId: number, body: CreatePaymentHistoryDto) {
    try {
      return await this.prisma.paymentHistory.create({
        data: {
          customerId: customerId,
          orderId: body.orderId ? Number(body.orderId) : null,
          currency: body.currency,
          paidAt: body.paidAt,
          total: +body.total,
          payType: body.payType,
          note: body.note,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(customerId: number, skip: number, take: number) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.paymentHistory.count({
          where: {
            customer: {id: customerId}
          }
        }),
        this.prisma.paymentHistory.findMany({
          take, skip,
          where: {
            customer: {id: customerId}
          }
        })
      ]);
      return {
        total, data
      };
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.paymentHistory.findUnique({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdatePaymentHistoryDto) {
    try {
      return await this.prisma.paymentHistory.update({
        where: {id},
        data: updates
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.paymentHistory.delete({
        where: {id},
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
