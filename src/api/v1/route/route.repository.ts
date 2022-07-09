import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateRouteDto} from "./dto/create-route.dto";
import {UpdateRouteDto} from "./dto/update-route.dto";
import {SearchRouteDto} from "./dto/search-route.dto";
import {CancelRouteDto} from "./dto/cancel-route.dto";
import {SortRouteEnum} from "./enums/sort-route.enum";

@Injectable()
export class RouteRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateRouteDto) {
    let orderIds: number[];
    let commodityIds: number[];

    if (body?.commodityIds?.length && !body?.orderIds?.length) {
      const commodities = await Promise.all(body.commodityIds.map(async commodityId => {
        return await this.prisma.commodity.findUnique({where: {id: commodityId}});
      }));
      orderIds = commodities.map(commodity => commodity.orderId);
    }

    if (body?.orderIds?.length && !body?.commodityIds?.length) {

    }

    try {
      // for (let i = 0; i < 50; i++) {
      //   const commodity = await this.prisma.commodity.findUnique({where: {id: i + 26}});
      //   if (commodity) {
      //     await this.prisma.route.create({
      //       data: {
      //         name: "BD - VT " + i,
      //         driver: "Tester " + 1,
      //         bsx: "77G15659" + i,
      //         startedAt: new Date(),
      //         commodities: {connect: {id: i + 26}},
      //       }
      //     });
      //     console.log("Đã tạo ", i);
      //   }
      // }
      return await this.prisma.route.create({
        data: {
          name: body.name,
          driver: body.driver,
          garage: body.garage,
          bsx: body.bsx,
          startedAt: body.startedAt,
          endedAt: body?.endedAt,
          orders: body?.orderIds?.length ? {connect: body.orderIds.map((id) => ({id: id}))} : {connect: orderIds?.map(id => ({id}))},
          commodities: {connect: body?.commodityIds?.map((id) => ({id: id}))},
        },
        include: {
          employee: true,
          locations: true,
          orders: {
            include: {
              province: true,
              district: true,
              ward: true,
              customer: true,
              commodities: true
            }
          },
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(search: SearchRouteDto) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.route.count({
          where: {
            OR: [
              {name: {contains: search?.search}},
              {driver: {contains: search?.search}},
              {bsx: {contains: search?.search}},
              {orders: {some: {customer: {lastName: {contains: search?.search}}}}}
            ],
            startedAt: search?.startedAt_start && search?.startedAt_end ? {
              gte: search.startedAt_start,
              lte: search.startedAt_end
            } : {},
            endedAt: search?.status !== -1
              ? search?.status === 1
                ? {notIn: null}
                : search?.status === 0
                  ? {in: null}
                  : {
                    gte: search.endedAt_start,
                    lte: search.endedAt_end
                  }
              : {},
            deleted: false
          },
        }),
        this.prisma.route.findMany({
          skip: search?.skip,
          take: search?.take,
          where: {
            OR: [
              {name: {contains: search?.search}},
              {driver: {contains: search?.search}},
              {bsx: {contains: search?.search}},
              {orders: {some: {customer: {lastName: {contains: search?.search}}}}}
            ],
            startedAt: search?.startedAt_start && search?.startedAt_end ? {
              gte: search.startedAt_start,
              lte: search.startedAt_end
            } : {},
            endedAt: search?.status !== -1
              ? search?.status === 1
                ? {notIn: null}
                : search?.status === 0
                  ? {in: null}
                  : {
                    gte: search.endedAt_start,
                    lte: search.endedAt_end
                  }
              : {},
            deleted: false
          },
          include: {
            employee: true,
            locations: true,
            orders: {
              include: {
                province: true,
                district: true,
                ward: true,
                customer: true,
                commodities: true
              }
            },
          },
          orderBy: search?.sort && search?.sortType
            ? search?.sort === SortRouteEnum.NAME
              ? {name: search.sortType}
              : search?.sort === SortRouteEnum.START
                ? {startedAt: search.sortType}
                : search?.sort === SortRouteEnum.END
                  ? {endedAt: search.sortType}
                  : search?.sort === SortRouteEnum.DRIVER
                    ? {driver: search.sortType}
                    : search?.sort === SortRouteEnum.BSX
                      ? {bsx: search.sortType}
                      : search?.sort === SortRouteEnum.GARAGE
                        ? {garage: search.sortType}
                        : {}
            : {startedAt: "asc"}
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
      return await this.prisma.route.findUnique({
        where: {id},
        include: {
          orders: {
            include: {
              commodities: {
                include: {route: true}
              },
              customer: true,
              province: true,
              district: true,
              ward: true,
            },
          },
          locations: true,
          employee: true,
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdateRouteDto) {
    try {
      const found = await this.prisma.route.findUnique({where: {id}});
      if (found.endedAt) {
        throw new BadRequestException("Chuyến xe đã hoàn thành. không được phép sửa.");
      }
      if (updates?.endedAt) {
        const route = await this.prisma.route.findUnique({where: {id}, select: {orders: true}});
        await Promise.all(route.orders?.map(async order => {
          await this.prisma.order.update({
            where: {id: order.id},
            data: {
              deliveredAt: updates.endedAt
            }
          });
        }));
      }
      return await this.prisma.route.update({
        where: {id},
        data: {
          name: updates.name,
          driver: updates.driver,
          garage: updates.garage,
          bsx: updates.bsx,
          startedAt: updates.startedAt,
          endedAt: updates.endedAt,
          orders: {connect: updates.orderIds?.map((id) => ({id: id}))},
          commodities: {connect: updates?.commodityIds?.map((id) => ({id: id}))},
        },
        include: {
          orders: {
            include: {
              commodities: true,
              customer: true,
              province: true,
              district: true,
              ward: true,
            },
          },
          locations: true,
          employee: true,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.route.delete({
        where: {id},
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async cancel(id: number, body: CancelRouteDto) {
    try {
      if (body.desId && body.cancelType === "ORDER") {
        this.prisma.order.findUnique({
          where: {id: body.desId},
          include: {commodities: true}
        }).then(order => {
          const commodityIds = order.commodities.map(commodity => commodity.id);
          this.prisma.route.update({
            where: {id: id},
            data: {commodities: {disconnect: commodityIds.map(id => ({id}))}}
          }).then();
        });
      }
      return await this.prisma.route.update({
        where: {id},
        data: body.cancelType === "COMMODITY"
          ? {commodities: {disconnect: {id: body.desId}}}
          : {orders: {disconnect: {id: body.desId}}},
        include: {
          orders: {
            include: {
              commodities: true,
              customer: true,
              ward: true,
            },
          },
          locations: true,
          employee: true,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
