import {BadRequestException, Injectable} from '@nestjs/common';
import {PrismaService} from "../../../prisma.service";
import {SearchHrOverviewDto} from "./dto/search-hr-overview.dto";
import {FilterTypeEntity} from "./entities/filter-type.entity";
import * as moment from "moment";
import {SearchSellOverviewDto} from "./dto/search-sell-overview.dto";
import {OptionFilterEnum, TypeSellEntity} from "./entities/type-sell.entity";

@Injectable()
export class OverviewService {
  constructor(private readonly prisma: PrismaService) {
  }

  async hr(search: SearchHrOverviewDto) {
    switch (search.filter) {
      case FilterTypeEntity.AGE: {
        const ages = (await this.prisma.employee.groupBy({
          by: ["birthday"],
          orderBy: {
            birthday: "asc"
          }
        })).map(e => moment().diff(e.birthday, "years"));

        return [...new Set(ages)].map((age, _, arr) => {
          const newAge = ages.filter(e => e === age);
          return {
            name: age,
            value: newAge.length / arr.length,
          };
        });
      }
    }
  }

  async sell(search: SearchSellOverviewDto) {
    switch (search.filter) {
      case TypeSellEntity.NATION: {
        const group = await this.prisma.order.groupBy({
          by: ["wardId"],
        });

        const data = await Promise.all(group.map(async ({wardId}) => {
          return await this.prisma.ward.findUnique({
            where: {id: wardId},
            select: {
              district: {
                select: {
                  province: true
                }
              }
            }
          });
        }));
        return await Promise.all(data.map(async (province) => {
          const name = province.district.province.name;
          if (search.option === OptionFilterEnum.CUSTOMER) {
            const customers = await Promise.all([true, false].map(async isPotential => {
              return await this.prisma.customer.count({
                where: {
                  isPotential: isPotential,
                  ward: {
                    district: {id: province.district.province.id}
                  }
                }
              });
            }));
            return {
              name,
              series: [
                {
                  name: "Tiềm năng",
                  value: customers[0],
                },
                {
                  name: "Không tiềm năng",
                  value: customers[1],
                }
              ],
            };
          } else if (search.option === OptionFilterEnum.SOLD) {
            const aggregate = await this.prisma.commodity.aggregate({
              where: {
                order: {
                  deliveredAt: {notIn: null},
                  destination: {
                    district: {id: province.district.province.id}
                  }
                }
              },
              _sum: {
                amount: true,
                more: true,
                gift: true,
              }
            });
            return {
              name,
              series: [
                {
                  name: "Mua",
                  value: aggregate._sum.amount,
                },
                {
                  name: "Mua thêm",
                  value: aggregate._sum.more,
                },
                {
                  name: "Tặng",
                  value: aggregate._sum.gift,
                },
              ],
            };
          } else if (search.option === OptionFilterEnum.SALES) {
            const aggregate = await this.prisma.order.aggregate({
              where: {
                deliveredAt: {notIn: null},
                destination: {
                  district: {id: province.district.province.id}
                }
              },
              _sum: {
                total: true,
              }
            });

            return {
              name,
              value: aggregate._sum.total,
            };
          } else {
            throw new BadRequestException(`Option unavailable. Please, check again`);
          }
        }));
      }
      case TypeSellEntity.YEAR: {
        throw new BadRequestException("Đang làm... estimate: 12h trưa 27/12 done");
      }
      case TypeSellEntity.AGENCY: {
        throw new BadRequestException("Đang làm... estimate: 12h trưa 27/12 done");
      }
      default: {
        throw new BadRequestException("filter không xác định");
      }
    }
  }
}
