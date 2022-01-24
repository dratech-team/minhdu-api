import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateOrderDto} from "./dto/create-order.dto";
import {UpdateOrderDto} from "./dto/update-order.dto";
import {SearchOrderDto} from "./dto/search-order.dto";
import {inspect} from "util";

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
            connect: body.commodityIds.map((id) => ({id})),
          },
          wardId: body.wardId,
        },
        include: {
          commodities: true,
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
          routes: true,
          destination: {
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
          paymentHistories: true
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(search: SearchOrderDto) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.order.count({
          where: {
            deliveredAt: search?.status !== undefined && search?.status !== null && !search?.deliveryStartedAt
              ? search.status === 1
                ? {notIn: null}
                : search.status === 0
                  ? {in: null}
                  : {}
              : search?.deliveryStartedAt && search?.deliveryEndedAt ? {
                gte: search?.deliveryStartedAt,
                lte: search?.deliveryEndedAt
              } : {},
            hide: search?.hide,
            customer: {
              lastName: {startsWith: search?.name, mode: "insensitive"},
              id: search?.customerId ? {equals: search?.customerId} : {}
            },
            createdAt: search?.createStartedAt && search?.createEndedAt ? {
              gte: search.createStartedAt,
              lte: search.createEndedAt,
            } : {},
            deleted: false
          },
        }),
        this.prisma.order.findMany({
          skip: search?.skip,
          take: search?.take,
          where: {
            deliveredAt: search?.status !== undefined && search?.status !== null && !search?.deliveryStartedAt
              ? search.status === 1
                ? {notIn: null}
                : search.status === 0
                  ? {in: null}
                  : {}
              : search?.deliveryStartedAt && search?.deliveryEndedAt ? {
                gte: search?.deliveryStartedAt,
                lte: search?.deliveryEndedAt
              } : {},
            hide: search?.hide,
            customer: {
              lastName: {startsWith: search?.name, mode: "insensitive"},
              id: search?.customerId ? {equals: search?.customerId} : {}
            },
            createdAt: search?.createStartedAt && search?.createEndedAt ? {
              gte: search.createStartedAt,
              lte: search.createEndedAt,
            } : {},
            deleted: false
          },
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
                        nation: true,
                      },
                    },
                  },
                },
              },
            },
            paymentHistories: true
          },
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
          commodities: {connect: updates?.commodityIds?.map((id) => ({id}))},
          wardId: updates?.wardId,
          hide: updates?.hide,
          deliveredAt: updates?.deliveredAt,
          explain: updates?.explain,
          total: updates?.total,
        },
        include: {
          commodities: true
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.order.update({
        where: {id},
        data: {deleted: true}
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
