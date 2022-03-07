import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateRouteDto} from "./dto/create-route.dto";
import {UpdateRouteDto} from "./dto/update-route.dto";
import {SearchRouteDto} from "./dto/search-route.dto";
import {CancelRouteDto} from "./dto/cancel-route.dto";

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
            name: {contains: search?.name},
            startedAt: {gte: search?.startedAt},
            endedAt: search?.status === 1 ? {notIn: null} : search?.status === 0 ? {in: null} : undefined,
            driver: {contains: search?.driver},
            bsx: {contains: search?.bsx},
            commodities: search?.hasRoute ? {
              every: {
                routeId: search.hasRoute ? {notIn: null} : {in: null},
              }
            } : {},
            deleted: false
          },
        }),
        this.prisma.route.findMany({
          skip: search?.skip,
          take: search?.take,
          where: {
            name: {contains: search?.name},
            startedAt: {gte: search?.startedAt},
            endedAt: search?.status === 1 ? {notIn: null} : search?.status === 0 ? {in: null} : undefined,
            driver: {contains: search?.driver},
            bsx: {contains: search?.bsx},
            commodities: search?.hasRoute ? {
              every: {
                routeId: search.hasRoute ? {notIn: null} : {in: null},
              }
            } : {},
            deleted: false
          },
          include: {
            employee: true,
            locations: true,
            orders: {
              include: {
                customer: true,
                commodities: true
              }
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
      return await this.prisma.route.findUnique({
        where: {id},
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
          orders: {set: updates.orderIds?.map((id) => ({id: id}))},
          commodities: {set: updates?.commodityIds?.map((id) => ({id: id}))},
        },
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

  async remove(id: number) {
    try {
      return await this.prisma.route.update({
        where: {id},
        data: {deleted: true}
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async cancel(id: number, body: CancelRouteDto) {
    try {
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
