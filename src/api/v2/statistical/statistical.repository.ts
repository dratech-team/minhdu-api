import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class StatisticalRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async statisticalOrder(startedAt: Date, endedAt: Date) {
    try {
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
      const provinces = await this.prisma.province.findMany();

      return provinces.map(province => {
        const order = orders.filter(order => order.destination.district.province.id === province.id);
        return {
          name: province.name,
          value: order.length ?? 0
        };
      });
    } catch (err) {
      console.error(err);
      throw  new BadRequestException(err);
    }
  }

  async statisticalCustomers() {
    try {
      const customers = await this.prisma.customer.findMany({
        include: {
          ward: {
            include: {
              district: {
                include: {
                  province: true
                }
              }
            }
          }
        }
      });


      const provinces = await this.prisma.province.findMany();

      return provinces.map(province => {
        const customer = customers.filter(customer => customer.ward.district.province.id === province.id);

        return {
          name: province.name,
          value: customer.length ?? 0
        };
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
