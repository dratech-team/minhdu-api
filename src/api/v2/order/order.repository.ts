import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateOrderDto} from "./dto/create-order.dto";
import {UpdateOrderDto} from "./dto/update-order.dto";
import {PaidEnum} from "./enums/paid.enum";
import {PaymentType} from "@prisma/client";
import {UpdatePaidDto} from "./dto/update-paid.dto";

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
          commodities: {
            connect: body.commodityIds.map(id => ({id}))
          },
          wardId: body.destinationId,
        },
        include: {
          commodities: true
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
          routes: true,
          destination: {
            include: {
              district: {
                include: {
                  province: {
                    include: {
                      nation: true
                    }
                  }
                }
              }
            }
          },
          paymentHistories: true
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(
    skip: number,
    take: number,
    paidType?: PaidEnum,
    firstName?: string,
    lastName?: string,
    payType?: PaymentType,
  ) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.order.count(),
        this.prisma.order.findMany({
          skip, take,
          where: {
            // paidAt: paidType === PaidEnum.PAID || paidType === PaidEnum.DEBT ? {not: null} : (paidType === PaidEnum.UNPAID ? {in: null} : {}),
            // debt: paidType === PaidEnum.DEBT ? {not: 0} : {},
            customer: {
              AND: {
                firstName: {startsWith: firstName, mode: 'insensitive'},
                lastName: {startsWith: lastName, mode: 'insensitive'},
              },
            },
            // payType: payType ? {in: payType} : {}
          },
          include: {
            commodities: true,
            customer: true,
            destination: {
              include: {
                district: {
                  include: {
                    province: {
                      include: {
                        nation: true
                      }
                    }
                  }
                }
              }
            },
            paymentHistories: true
          }
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
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  // async paid(id: number, updates: UpdatePaidDto) {
  //   try {
  //     const order = await this.findOne(id);
  //     return await this.prisma.order.update({
  //       where: {id},
  //       data: {
  //         debt: order.debt + updates.paidTotal,
  //         paidAt: updates.paidAt,
  //       },
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     throw new BadRequestException(err);
  //   }
  // }

  async remove(id: number) {
    try {
      await this.prisma.order.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
