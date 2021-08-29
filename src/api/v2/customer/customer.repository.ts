import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../prisma.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { Customer, CustomerResource, CustomerType } from "@prisma/client";
import { CreatePaymentHistoryDto } from "../payment-history/dto/create-payment-history.dto";

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: CreateCustomerDto) {
    try {
      return await this.prisma.customer.create({ data: body });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(
    skip: number,
    take: number,
    firstName: string,
    lastName: string,
    phone: string,
    nationId: number,
    type: CustomerType,
    resource: CustomerResource,
    isPotential: number
  ) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.customer.count(),
        this.prisma.customer.findMany({
          skip,
          take,
          where: {
            AND: {
              firstName: { startsWith: firstName, mode: "insensitive" },
              lastName: { startsWith: firstName, mode: "insensitive" },
            },
            phone: { startsWith: phone, mode: "insensitive" },
            // ward: {district: {province: {nation: {id: nationId}}}},
            type: type ? { in: type } : {},
            resource: resource ? { in: resource } : {},
            /// FIXME: bug
            isPotential: isPotential ? { equals: isPotential !== 0 } : {},
          },
          include: {
            ward: {
              include: {
                district: {
                  include: {
                    province: {
                      include: {
                        nation: true,
                      },
                    },
                  },
                },
              },
            },
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
      return await this.prisma.customer.findUnique({
        where: { id },
        include: {
          orders: {
            include: {
              commodities: true,
            },
          },
          ward: {
            include: {
              district: {
                include: {
                  province: {
                    include: {
                      nation: true,
                    },
                  },
                },
              },
            },
          },
          paymentHistories: {
            include: {
              order: true,
            },
          },
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdateCustomerDto) {
    try {
      return await this.prisma.customer.update({
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
      return await this.prisma.customer.delete({ where: { id } });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async transactionDebt(
    customerId: Customer["id"],
    payment: CreatePaymentHistoryDto
  ) {
    try {
      const customer = await this.findOne(customerId);

      const createdPay = this.prisma.paymentHistory.create({
        data: Object.assign(payment, {customerId}),
      });

      const updated = this.prisma.customer.update({
        where: { id: customerId },
        data: { debt: customer.debt + payment.total },
      });

      await this.prisma.$transaction([createdPay, updated]);
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
