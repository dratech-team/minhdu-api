import {BadRequestException, Injectable} from "@nestjs/common";
import {Customer} from "@prisma/client";
import {PrismaService} from "../../../prisma.service";
import {CreatePaymentHistoryDto} from "../payment-history/dto/create-payment-history.dto";
import {CreateCustomerDto} from "./dto/create-customer.dto";
import {SearchCustomerDto} from "./dto/search-customer.dto";
import {UpdateCustomerDto} from "./dto/update-customer.dto";

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateCustomerDto) {
    try {
      return await this.prisma.customer.create({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(search: SearchCustomerDto) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.customer.count({
          where: {
            lastName: search?.name,
            phone: {startsWith: search?.phone, mode: "insensitive"},
            // ward: {district: {province: {nation: {id: nationId}}}},
            type: search?.customerType ? {in: search.customerType} : {},
            resource: search?.resource ? {in: search?.resource} : {},
            isPotential: search?.isPotential,
          }
        }),
        this.prisma.customer.findMany({
          skip: search?.skip,
          take: search?.take,
          where: {
            lastName: search?.name,
            phone: {startsWith: search?.phone, mode: "insensitive"},
            // ward: {district: {province: {nation: {id: nationId}}}},
            type: search?.customerType ? {in: search.customerType} : {},
            resource: search?.resource ? {in: search.resource} : {},
            isPotential: search?.isPotential,
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
      return {total, data};
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      const order = await this.prisma.order.aggregate({
        where: {
          customerId: id,
          hide: false,
        },
        _sum: {
          total: true,
        }
      });
      const payment = await this.prisma.paymentHistory.aggregate({
        where: {
          customerId: id
        },
        _sum: {
          total: true,
        }
      });

      const customer = await this.prisma.customer.findUnique({
        where: {id},
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
      });
      return Object.assign(customer, {debt: payment._sum.total - order._sum.total});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdateCustomerDto) {
    try {
      return await this.prisma.customer.update({
        where: {id},
        data: updates,
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.customer.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async payment(customerId: Customer["id"], payment: CreatePaymentHistoryDto) {
    try {
      const customer = await this.prisma.customer.findUnique({where: {id: customerId}});

      const pay = this.prisma.paymentHistory.create({
        data: Object.assign(payment, {customerId}),
      });

      const debt = this.prisma.customer.update({
        where: {id: customerId},
        data: {
          debt: customer.debt + payment.total,
        }
      });
      return (await this.prisma.$transaction([pay, debt]))[0];
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
