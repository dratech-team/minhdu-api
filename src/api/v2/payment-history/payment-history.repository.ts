import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreatePaymentHistoryDto} from "./dto/create-payment-history.dto";
import {UpdatePaymentHistoryDto} from "./dto/update-payment-history.dto";

@Injectable()
export class PaymentHistoryRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreatePaymentHistoryDto) {
    try {
      const order = await this.prisma.order.findUnique({where: {id: body.orderId}, include: {customer: true}});

      const pay = this.prisma.payment.create({
        data: Object.assign(body, {customerId: order.customerId}),
      });

      const debt = this.prisma.customer.update({
        where: {id: order.customerId},
        data: {
          debt: order.customer.debt + body.total,
        }
      });
      return (await this.prisma.$transaction([pay, debt]))[0];
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(customerId: number, skip: number, take: number) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.payment.count({
          where: {
            customer: {id: customerId},
          },
        }),
        this.prisma.payment.findMany({
          take,
          skip,
          where: {
            customer: {id: customerId},
          },
        }),
      ]);
      return {
        total,
        data,
      };
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.payment.findUnique({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdatePaymentHistoryDto) {
    try {
      const payment = await this.findOne(id);
      const customer = await this.prisma.customer.findUnique({where: {id: payment.customerId}});

      const updatedPay = this.prisma.payment.update({
        where: {id},
        data: updates,
      });

      const updatedCustomer = this.prisma.customer.update({
        where: {id: customer.id},
        data: {debt: customer.debt - payment.total + updates.total},
      });
      return (await this.prisma.$transaction([updatedPay, updatedCustomer]))[0];
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      const payment = await this.findOne(id);
      const customer = await this.prisma.customer.findUnique({where: {id: payment.customerId}});

      const deleted = this.prisma.payment.delete({
        where: {id},
      });
      const updated = this.prisma.customer.update({
        where: {id: payment.customerId},
        data: {debt: customer.debt - payment.total}
      });

      return (await this.prisma.$transaction([deleted, updated]))[0];
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
