import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateOrderDto} from "./dto/create-order.dto";
import {UpdateOrderDto} from "./dto/update-order.dto";
import {SearchOrderDto} from "./dto/search-order.dto";
import {PaidEnum} from "./enums/paid.enum";

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
          endedAt: body.endedAt,
          deliveredAt: body.deliveredAt,
          explain: body.explain,
          commodities: {
            connect: body.commodityIds.map((id) => ({id})),
          },
          provinceId: body?.provinceId,
          districtId: body?.districtId,
          wardId: body.wardId,
        },
        include: {
          commodities: true,
          customer: true,
          province: true,
          district: true,
          ward: true
        },
      });
    } catch (err) {
      console.error(err);
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
          province: true,
          district: true,
          ward: true,
          paymentHistories: true,
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(search: Partial<SearchOrderDto>) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.order.count({
          where: {
            createdAt: (search?.startedAt_start && search?.startedAt_end)
              ? {
                gte: search.startedAt_start,
                lte: search.startedAt_end,
              }
              : {},
            endedAt: (search?.endedAt_start && search?.endedAt_end)
              ? {
                gte: search.endedAt_start,
                lte: search.endedAt_end,
              } : {},
            deliveredAt: search?.status !== -1
              ? (search?.deliveredAt_start && search?.deliveredAt_end
                ? {
                  gte: search?.deliveredAt_start,
                  lte: search?.deliveredAt_end,
                }
                : search.status === 1
                  ? {notIn: null}
                  : {in: null})
              : {},
            hide: search?.hiddenDebt !== -1 ? {equals: search?.hiddenDebt === 1} : {},
            customer: search?.customerId
              ? {id: {in: search?.customerId}}
              : {lastName: {contains: search?.search, mode: "insensitive"}},
            paymentHistories:
              search?.paidType === PaidEnum.PAID
                ? {some: {total: {gte: 0}}}
                : search?.paidType === PaidEnum.UNPAID
                  ? {every: {total: {}}}
                  : {},
            province: search?.province
              ? {name: {contains: search?.province, mode: "insensitive"}}
              : {},
            commodities: search?.filterRoute === 'true'
              ? {
                some: {
                  routeId: {in: null}
                },
              }
              : search?.commodity
                ? {
                  some: {
                    OR: [
                      {
                        code: {startsWith: search?.commodity, mode: "insensitive"},
                      },
                      {
                        name: {contains: search?.commodity, mode: "insensitive"},
                      },
                    ],
                  }
                }
                : {},
            deletedAt: {in: null},
            canceledAt: {in: null}
          },
        }),
        this.prisma.order.findMany({
          skip: search?.skip,
          take: search?.take,
          where: {
            createdAt: (search?.startedAt_start && search?.startedAt_end)
              ? {
                gte: search.startedAt_start,
                lte: search.startedAt_end,
              }
              : {},
            endedAt: (search?.endedAt_start && search?.endedAt_end)
              ? {
                gte: search.endedAt_start,
                lte: search.endedAt_end,
              } : {},
            deliveredAt: search?.status !== -1
              ? (search?.deliveredAt_start && search?.deliveredAt_end
                ? {
                  gte: search?.deliveredAt_start,
                  lte: search?.deliveredAt_end,
                }
                : search.status === 1
                  ? {notIn: null}
                  : {in: null})
              : {},
            hide: search?.hiddenDebt !== -1 ? {equals: search?.hiddenDebt === 1} : {},
            customer: search?.customerId
              ? {id: {in: search?.customerId}}
              : {lastName: {contains: search?.search, mode: "insensitive"}},
            paymentHistories:
              search?.paidType === PaidEnum.PAID
                ? {some: {total: {gte: 0}}}
                : search?.paidType === PaidEnum.UNPAID
                  ? {every: {total: {}}}
                  : {},
            province: search?.province
              ? {name: {contains: search?.province, mode: "insensitive"}}
              : {},
            commodities: search?.filterRoute === 'true'
              ? {
                some: {
                  routeId: {in: null}
                },
              }
              : search?.commodity
                ? {
                  some: {
                    OR: [
                      {
                        code: {startsWith: search?.commodity, mode: "insensitive"},
                      },
                      {
                        name: {contains: search?.commodity, mode: "insensitive"},
                      },
                    ],
                  }
                }
                : {},
            deletedAt: {in: null},
            canceledAt: {in: null}
          },
          include: {
            commodities: {
              include: {
                route: true
              }
            },
            customer: true,
            province: true,
            district: true,
            ward: true,
            paymentHistories: true,
          },
          orderBy: search.key === 'customer'
            ? {customer: {lastName: search.directions}}
            : search.key === 'destination'
              ? {province: {name: search.directions}}
              : {[search.key]: search.directions}
        }),
      ]);
      return {total, data};
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: Partial<UpdateOrderDto>) {
    try {
      return await this.prisma.order.update({
        where: {id},
        data: {
          commodities: {
            connect: updates?.commodityIds?.map((id) => ({id})),
          },
          provinceId: updates?.provinceId,
          districtId: updates?.districtId,
          wardId: updates?.wardId,
          hide: updates?.hide,
          createdAt: updates?.createdAt,
          endedAt: updates?.endedAt,
          deliveredAt: updates?.deliveredAt,
          explain: updates?.explain,
          total: updates?.total,
        },
        include: {
          commodities: true,
          customer: true,
          province: true,
          district: true,
          ward: true,
          paymentHistories: true,
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number, reason?: string) {
    try {
      if (reason) {
        return await this.prisma.order.update({
          where: {id},
          data: {
            canceledAt: new Date(),
            reason: reason
          },
        });
      }
      return await this.prisma.order.delete({where: {id}});

    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
