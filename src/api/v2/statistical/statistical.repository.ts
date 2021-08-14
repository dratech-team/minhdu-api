import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class StatisticalRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async statisticalOrder(startedAt: Date, endedAt: Date) {
    try {
      const [provinces, orders] = await Promise.all([
        this.prisma.province.findMany(),
        this.prisma.order.findMany({
          where: {
            createdAt: {
              gte: startedAt,
              lte: endedAt,
            }
          },
          select: {
            destination: {
              select: {
                district: {
                  select: {
                    province: {
                      select: {
                        id: true
                      }
                    }
                  }
                }
              }
            }
          }
        })
      ]);
      return {provinces, orders};
    } catch (err) {
      console.error(err);
      throw  new BadRequestException(err);
    }
  }

  async statisticalCustomers() {
    try {
      const [provinces, customers] = await Promise.all([
        this.prisma.province.findMany(),
        this.prisma.customer.findMany({
          include: {
            ward: {
              select: {
                district: {
                  select: {
                    province: {
                      select: {
                        id: true
                      }
                    }
                  }
                }
              }
            },
            orders: {
              include: {
                commodities: true,
                paymentHistories: true,
              }
            }
          }
        }),
      ]);

      return {provinces, customers};
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }


  async commodities() {
    try {
      const [provinces, commodities] = await Promise.all([
        this.prisma.province.findMany(),
        this.prisma.commodity.findMany({
          include: {
            order: {
              select: {
                destination: {
                  select: {
                    district: {
                      select: {
                        province: {
                          select: {
                            id: true
                          }
                        }
                      }
                    }
                  }
                },
              }
            }
          }
        }),
      ]);
      return {provinces, commodities};
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
