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
      return await this.prisma.customer.create({
        data: {
          lastName: body.lastName,
          gender: body?.gender,
          phone: body.phone,
          workPhone: body?.workPhone,
          birthday: body?.birthday,
          birthplace: body?.birthplace,
          identify: body?.identify,
          idCardAt: body?.idCardAt,
          issuedBy: body?.issuedBy,
          province: body?.provinceId ? {connect: {id: body.provinceId}} : {},
          district: body?.districtId ? {connect: {id: body.districtId}} : {},
          ward: body?.wardId ? {connect: {id: body.wardId}} : {},
          address: body?.address,
          religion: body?.religion,
          // ethnicity: body?.ethnicity,
          mst: body?.mst,
          type: body?.type,
          resource: body?.resource,
          isPotential: body?.isPotential,
          note: body?.note,
        },
      });
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
            lastName: {startsWith: search?.name, mode: "insensitive"},
            phone: {startsWith: search?.phone, mode: "insensitive"},
            gender: search?.gender ? {in: search.gender} : {},
            type: search?.customerType ? {in: search.customerType} : {},
            resource: search?.resource ? {in: search?.resource} : {},
            isPotential:
              search?.isPotential === 1
                ? true
                : search?.isPotential === 0
                ? false
                : {},
          },
        }),
        this.prisma.customer.findMany({
          skip: search?.skip,
          take: search?.take,
          where: {
            lastName: {startsWith: search?.name, mode: "insensitive"},
            phone: {startsWith: search?.phone, mode: "insensitive"},
            gender: search?.gender ? {in: search.gender} : {},
            type: search?.customerType ? {in: search.customerType} : {},
            resource: search?.resource ? {in: search.resource} : {},
            isPotential:
              search?.isPotential === 1
                ? true
                : search?.isPotential === 0
                ? false
                : {},
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
          deleted: false,
          deliveredAt: {not: null},
        },
        _sum: {
          total: true,
        },
      });
      const payment = await this.prisma.paymentHistory.aggregate({
        where: {
          customerId: id,
        },
        _sum: {
          total: true,
        },
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
          province: true
        },
      });

      console.log(order._sum.total);
      return Object.assign(customer, {
        debt: payment._sum.total - order._sum.total,
      });
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
      const customer = await this.prisma.customer.findUnique({
        where: {id: customerId},
      });

      const pay = this.prisma.paymentHistory.create({
        data: Object.assign(payment, {customerId}),
      });

      const debt = this.prisma.customer.update({
        where: {id: customerId},
        data: {
          debt: customer.debt + payment.total,
        },
      });
      return (await this.prisma.$transaction([pay, debt]))[0];
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
