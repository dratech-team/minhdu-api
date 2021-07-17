import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class StatisticalRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async statisticalNation(startedAt: Date, endedAt: Date) {
    console.log('started at', startedAt);
    console.log('endedAt at', endedAt);
    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: startedAt,
          lte: endedAt,
        }
      },
      include: {
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
        }
      }
    });
    console.log('====', orders.map(order => order.destination.district.province.nation.id));
    const provinces = await this.prisma.province.findMany();

    return provinces.map(province => {
      const order = orders.filter(order => order.destination.district.province.id === province.id);
      return {
        province: province.name,
        order: order.length ?? 0
      };
    });
  }
}
