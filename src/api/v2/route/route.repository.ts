import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateRouteDto} from "./dto/create-route.dto";
import {UpdateRouteDto} from "./dto/update-route.dto";
import {SearchRouteDto} from "./dto/search-route.dto";

@Injectable()
export class RouteRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateRouteDto) {
    try {
      return await this.prisma.route.create({
        data: {
          name: body.name,
          driver: body.driver,
          garage: body.garage,
          bsx: body.bsx,
          startedAt: body.startedAt,
          endedAt: body?.endedAt,
          orders: {connect: body?.orderIds?.map((id) => ({id: id}))},
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(
    skip?: number,
    take?: number,
    search?: Partial<SearchRouteDto>
  ) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.route.count({
          skip: skip,
          take: take,
          where: {
            name: {contains: search?.name},
            startedAt: {gte: search?.startedAt},
            endedAt: {lte: search?.endedAt},
            driver: {contains: search?.driver || undefined},
            bsx: {contains: search?.bsx},
          },
        }),
        this.prisma.route.findMany({
          skip: skip,
          take: take,
          where: {
            name: {contains: search?.name},
            startedAt: {gte: search?.startedAt},
            endedAt: {lte: search?.endedAt},
            driver: {contains: search?.driver || undefined},
            bsx: {contains: search?.bsx},
          },
          include: {
            employee: true,
            locations: true,
            orders: true,
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
              customer: true,
              destination: true,
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

  /*
   * Route thì set lại đơn hàng. Vì đơn hàng của nhiều khách hàng khác nhau có thể được chọn lại trên những xe khác nhau
   * */
  async update(id: number, updates: UpdateRouteDto) {
    try {
      return await this.prisma.route.update({
        where: {id},
        data: {
          name: updates.name,
          driver: updates.driver,
          garage: updates.garage,
          bsx: updates.bsx,
          startedAt: updates.startedAt,
          endedAt: updates.endedAt,
          orders: {set: updates.orderIds.map((id) => ({id: id}))},
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.route.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async finds(search?: Partial<CreateRouteDto>) {
    return await this.prisma.route.findMany();
  }
}
