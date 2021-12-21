import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateOrderDto} from "./dto/create-order.dto";
import {UpdateOrderDto} from "./dto/update-order.dto";
import {SearchOrderDto} from "./dto/search-order.dto";
import {searchName} from "../../../utils/search-name.util";

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
          paymentHistories: true,
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(
    skip: number,
    take: number,
    search?: Partial<SearchOrderDto>,
  ) {
    try {
      const name = searchName(search?.customer);
      const [total, data] = await Promise.all([
        this.prisma.order.count({
          where: {
            deliveredAt: search?.delivered === 1 ? {not: null} : (search?.delivered === 0 ? null : undefined),
            hide: search?.hide,
            customer: {
              AND: {
                firstName: name?.firstName,
                lastName: name?.lastName,
              },
              id: search?.customerId ? {equals: search?.customerId} : {}
            }
          },
        }),
        this.prisma.order.findMany({
          skip: skip || undefined,
          take: take || undefined,
          where: {
            deliveredAt: search?.delivered === 1 ? {not: null} : (search?.delivered === 0 ? null : undefined),
            hide: search?.hide,
            customer: {
              AND: {
                firstName: name?.firstName,
                lastName: name?.lastName,
              },
              id: search?.customerId ? {equals: search?.customerId} : {}
            }
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
      return {
        total,
        data,
      };
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  /*
   * Order thì Thêm mới hoặc xoá hàng hoá. 1 hàng hoá chỉ tồn tại cho 1 đơn hàng
   * */
  async update(id: number, updates: Partial<UpdateOrderDto>) {
    try {
      const updated = await this.prisma.order.update({
        where: {id},
        data: {
          commodities: {connect: updates?.commodityIds?.map((id) => ({id}))},
          deliveredAt: updates?.deliveredAt,
          hide: updates?.hide,
          createdAt: updates?.createdAt,
          explain: updates?.explain,
          wardId: updates?.wardId,
        },
        include: {
          commodities: true
        }
      });
      if (updated.deliveredAt && updates.deliveredAt) {
        await this.prisma.customer.update({
          where: {id: updated.customerId},
          data: {debt: -updates.total}
        });
      }
      return updated;
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      const order = await this.prisma.order.findUnique({where: {id}});
      const customer = await this.prisma.customer.findUnique({where: {id: order.customerId}});

      const deleted = this.prisma.order.delete({where: {id}});
      const updated = this.prisma.customer.update({
        where: {id: order.customerId},
        data: {debt: customer.debt + order.total}
      });

    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
