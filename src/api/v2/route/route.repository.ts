import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateRouteDto} from "./dto/create-route.dto";
import {UpdateRouteDto} from "./dto/update-route.dto";

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
          employee: {connect: {id: body.employeeId}},
          garage: body.garage,
          bsx: body.bsx,
          startedAt: body.startedAt,
          endedAt: body.endedAt,
          orders: {connect: body?.orderIds?.map((id => ({id: id})))},
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      const [total, data] = await Promise.all([
        this.prisma.route.count(),
        this.prisma.route.findMany(),
      ]);
      return {total, data};
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.route.findUnique({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdateRouteDto) {
    try {
      return await this.prisma.route.update({
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
      await this.prisma.route.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
