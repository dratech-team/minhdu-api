import {BadRequestException, Injectable} from "@nestjs/common";
import {Customer} from "@prisma/client";
import {searchName} from "src/utils/search-name.util";
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

  async findAll(
    skip: number,
    take: number,
    search?: Partial<SearchCustomerDto>
  ) {
    try {
      const name = searchName(search?.name);

      const [total, data] = await Promise.all([
        this.prisma.customer.count(),
        this.prisma.customer.findMany({
          skip,
          take,
          where: {
            AND: {
              firstName: {startsWith: name?.firstName, mode: "insensitive"},
              lastName: {startsWith: name?.lastName, mode: "insensitive"},
            },
            phone: {startsWith: search?.phone, mode: "insensitive"},
            // ward: {district: {province: {nation: {id: nationId}}}},
            type: search?.type ? {in: search?.type} : {},
            resource: search?.resource ? {in: search?.resource} : {},
            /// FIXME: bug
            isPotential: search?.isPotential
              ? {equals: search?.isPotential !== 0}
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
      return await this.prisma.customer.findUnique({
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
      await this.prisma.$transaction([pay, debt]);
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
