import {BadRequestException, Injectable} from '@nestjs/common';
import {PrismaService} from "../../../prisma.service";
import {SearchHrOverviewDto} from "./dto/search-hr-overview.dto";
import {FilterTypeEntity} from "./entities/filter-type.entity";
import * as moment from "moment";
import {SearchSellOverviewDto} from "./dto/search-sell-overview.dto";
import {DELIVERY_STATUS, FilterSellEntity, OptionFilterEnum} from "./entities/filter-sell.entity";
import {firstDatetime, lastDatetime} from "../../../utils/datetime.util";
import {CustomerType} from '@prisma/client';

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

        return Array.of({
            name: "Chưa đủ tuổi",
            value: (ages.filter(e => e < 18).length * 100) / ages.length,
          },
          {
            name: "Từ 18 - 30 tuổi",
            value: (ages.filter(e => e >= 18 && e <= 30).length * 100) / ages.length,
          },
          {
            name: "Từ 31 - 50 tuổi",
            value: (ages.filter(e => e > 30 && e <= 50).length * 100) / ages.length,
          },
          {
            name: "Ngoài 50 tuổi",
            value: (ages.filter(e => e > 50).length * 100) / ages.length,
          });
      }
      case FilterTypeEntity.CREATED_AT : {
        const groupBy = (await this.prisma.employee.groupBy({
          by: ["createdAt"],
          orderBy: {
            createdAt: "asc"
          }
        }));
        return await Promise.all([...new Set(groupBy.map(e => Number(moment(e.createdAt).format("YYYY"))))].map(async e => {
          const count = await Promise.all([true, false].map(async isLeft => {
            const a = await this.prisma.employee.count({
              where: {
                leftAt: isLeft ? {notIn: null} : {in: null},
                createdAt: {
                  gte: firstDatetime(new Date(`${e}-01-01`), "years"),
                  lte: lastDatetime(new Date(`${e}-01-01`), "years"),
                }
              }
            });
            return {
              name: isLeft ? "Nghỉ việc" : "Vào làm",
              value: a,
            };
          }));
          return {
            name: e,
            series: count
          };
        }));
      }
      default: {
        throw new BadRequestException("filter không hợp lệ");
      }
    }
  }

  async sell(search: SearchSellOverviewDto) {
    switch (search.filter) {
      case FilterSellEntity.NATION: {
        const orderGroup = await this.prisma.order.groupBy({
          by: ["wardId"],
          where: {
            deliveredAt: search?.startedAt && search?.endedAt ? {
              gte: search.startedAt,
              lte: search.endedAt,
            } : {}
          }
        });

        const customerGroup = await this.prisma.customer.groupBy({
          by: ['wardId'],
          where: {
            timestamp: search?.startedAt && search?.endedAt ? {
              gte: search.startedAt,
              lte: search.endedAt
            } : {}
          }
        });

        if (search.option === OptionFilterEnum.SOLD) {
          return await Promise.all(orderGroup.map(async e => {
            const province = await this.prisma.ward.findUnique({
              where: {id: e.wardId},
              select: {
                district: {
                  select: {
                    province: true
                  }
                }
              }
            });

            const aggregate = await this.prisma.commodity.aggregate({
              _sum: {
                amount: true,
                gift: true,
                more: true
              },
              where: {
                order: {
                  wardId: e.wardId,
                  deliveredAt: search?.startedAt && search?.endedAt ? {
                    gte: search.startedAt,
                    lte: search.endedAt,
                  } : {}
                }
              }
            });

            return {
              name: province.district.province.name,
              series: Array.of(
                {
                  name: "Gà bán",
                  value: Number(aggregate._sum.amount),
                },
                {
                  name: "Gà mua thêm",
                  value: Number(aggregate._sum.more),
                },
                {
                  name: "Gà tặng",
                  value: Number(aggregate._sum.gift),
                }
              )
            };
          }));
        } else if (search.option === OptionFilterEnum.CUSTOMER) {
          return await Promise.all(customerGroup.map(async e => {
            const ward = await this.prisma.ward.findUnique({
              where: {id: e.wardId},
              select: {
                district: {
                  select: {
                    province: true
                  }
                }
              }
            });
            const a = await Promise.all([CustomerType.AGENCY, CustomerType.RETAIL].map(async type => {
              const count = await this.prisma.customer.count({
                where: {
                  type,
                  wardId: e.wardId,
                }
              });
              return {
                name: type === CustomerType.AGENCY ? "Đại lý" : "Khách lẻ",
                value: count,
              };
            }));
            return {
              name: ward.district.province.name,
              series: a,
            };
          }));
        } else if (search.option === OptionFilterEnum.SALES) {
          return await Promise.all(orderGroup.map(async e => {
            const ward = await this.prisma.ward.findUnique({
              where: {id: e.wardId},
              select: {
                district: {
                  select: {
                    province: true,
                  }
                }
              }
            });
            const a = await Promise.all([true, false].map(async isHide => {
              const aggregate = await this.prisma.order.aggregate({
                where: {
                  hide: isHide,
                  wardId: e.wardId,
                },
                _sum: {
                  total: true,
                }
              });
              return {
                name: isHide ? "Ẩn nợ" : "Doanh thu",
                value: Number(aggregate._sum.total),
              };
            }));
            return {
              name: ward.district.province.name,
              series: a,
            };
          }));
        } else if (search.option === OptionFilterEnum.ORDER) {
          return await Promise.all(orderGroup.map(async e => {
            const ward = await this.prisma.ward.findUnique({
              where: {id: e.wardId},
              select: {
                district: {
                  select: {
                    province: true,
                  }
                }
              }
            });
            const series = await Promise.all([DELIVERY_STATUS.COMPLETE, DELIVERY_STATUS.DELIVERY, DELIVERY_STATUS.CANCEL].map(async status => {
              const count = await this.prisma.order.count({
                where: {
                  wardId: e.wardId,
                  deleted: status === DELIVERY_STATUS.CANCEL,
                  deliveredAt: status === DELIVERY_STATUS.COMPLETE ? {notIn: null} : {in: null}
                }
              });
              return {
                name: status === DELIVERY_STATUS.COMPLETE ? "Hoàn thành" : status === DELIVERY_STATUS.DELIVERY ? "Đang giao" : "Đã hủy",
                value: count,
              };
            }));
            return {
              name: ward.district.province.name,
              series: series
            };
          }));
        } else if (search.option === OptionFilterEnum.ROUTE) {
          throw new BadRequestException("Đang làm");
        } else {
          throw new BadRequestException("Option unavailable. option for filter NATION are: SOLD | SALES | CUSTOMER");
        }
      }
      case FilterSellEntity.YEAR: {
        if (search.option === OptionFilterEnum.CUSTOMER) {
          const years = [...new Set((await this.prisma.customer.groupBy({
            by: ["timestamp"],
            orderBy: {
              timestamp: "asc"
            },
            where: {
              timestamp: search?.startedAt && search?.endedAt ? {
                gte: search.startedAt,
                lte: search.endedAt,
              } : {}
            }
          })).map(e => Number(moment(e.timestamp).format("YYYY"))))];

          return await Promise.all(years.map(async year => {
            const count = await Promise.all([CustomerType.AGENCY, CustomerType.RETAIL].map(async type => {
              const value = await this.prisma.customer.count({
                where: {
                  type,
                  timestamp: {
                    gte: firstDatetime(new Date(`${year}-01-01`), "years"),
                    lte: lastDatetime(new Date(`${year}-01-01`), "years"),
                  }
                }
              });
              return {
                name: type === CustomerType.AGENCY ? "Đại lý" : "Khách lẻ",
                value
              };
            }));
            return {
              name: year,
              series: count
            };
          }));
        } else if (search.option === OptionFilterEnum.SOLD) {
          const years = [...new Set((await this.prisma.order.groupBy({
            by: ["deliveredAt"],
            orderBy: {
              deliveredAt: "asc"
            },
            where: {
              deliveredAt: search?.startedAt && search?.endedAt ? {
                gte: search.startedAt,
                lte: search.endedAt,
              } : {}
            }
          })).map(e => Number(moment(e.deliveredAt).format("YYYY"))))];

          return await Promise.all(years.map(async year => {
            const aggregate = await this.prisma.commodity.aggregate({
              where: {
                order: {
                  deliveredAt: {
                    gte: firstDatetime(new Date(`${year}-01-01`), "years"),
                    lte: lastDatetime(new Date(`${year}-01-01`), "years"),
                  }
                }
              },
              _sum: {
                more: true,
                gift: true,
                amount: true,
              }
            });
            return {
              name: year,
              series: Array.of(
                {
                  name: "Gà bán",
                  value: aggregate._sum.amount,
                },
                {
                  name: "Gà mua thêm",
                  value: aggregate._sum.more,
                },
                {
                  name: "Gà tặng",
                  value: aggregate._sum.gift,
                },
              )
            };
          }));
        } else if (search.option === OptionFilterEnum.SALES) {
          const years = [...new Set((await this.prisma.order.groupBy({
            by: ["deliveredAt"],
            orderBy: {
              deliveredAt: "asc"
            },
            where: {
              deliveredAt: search?.startedAt && search?.endedAt ? {
                gte: search.startedAt,
                lte: search.endedAt,
              } : {}
            }
          })).map(e => Number(moment(e.deliveredAt).format("YYYY"))))];

          return await Promise.all(years.map(async (year) => {
            const a = await Promise.all([true, false].map(async isHide => {
              const b = await this.prisma.order.aggregate({
                _sum: {
                  total: true
                },
                where: {
                  hide: isHide,
                  deliveredAt: {
                    gte: firstDatetime(new Date(`${year}-01-01`), "years"),
                    lte: lastDatetime(new Date(`${year}-01-01`), "years"),
                  }
                },
              });
              return Array.of(
                {
                  name: isHide ? "Ẩn nợ" : "Doanh thu",
                  value: b._sum.total || 0,
                }
              );
            }));
            return {
              name: year,
              series: a
            };
          }));
        } else if (search.option === OptionFilterEnum.ORDER) {
          throw new BadRequestException("Đang làm");
        } else if (search.option === OptionFilterEnum.ROUTE) {
          throw new BadRequestException("Đang làm");
        } else {
          throw new BadRequestException("Option unavailable. option for filter YEAR are: SOLD | SALES | CUSTOMER");
        }
      }
      case FilterSellEntity.CUSTOMER: {
        const customerGroup = await this.prisma.customer.groupBy({
          by: ['id'],
          where: {
            timestamp: search?.startedAt && search?.endedAt ? {
              gte: search.startedAt,
              lte: search.endedAt
            } : {}
          }
        });
        if (search.option === OptionFilterEnum.SALES) {
          return await Promise.all(customerGroup.map(async e => {
            const customer = await this.prisma.customer.findUnique({
              where: {id: e.id},
              select: {
                lastName: true,
              }
            });
            const a = await Promise.all([true, false].map(async isHide => {
              const aggregate = await this.prisma.order.aggregate({
                where: {
                  customerId: e.id,
                  hide: isHide,
                },
                _sum: {
                  total: true
                },
              });
              return {
                name: isHide ? "Ẩn nợ" : "Doanh thu",
                value: Number(aggregate._sum.total),
              };
            }));
            return {
              name: customer.lastName,
              series: a
            };
          }));
        } else if (search.option === OptionFilterEnum.SOLD) {
          const customers = await Promise.all(customerGroup.map(async e => {
            const customer = await this.prisma.customer.findUnique({
              where: {id: e.id},
              select: {
                lastName: true,
              }
            });
            const aggregate = await this.prisma.commodity.aggregate({
              where: {
                order: {
                  customerId: e.id,
                }
              },
              _sum: {
                amount: true,
                more: true,
                gift: true,
              }
            });

            return {
              name: customer.lastName,
              amount: aggregate._sum.amount,
              more: aggregate._sum.more,
              gift: aggregate._sum.gift,
            };
          }));
          return customers.filter(customer => customer.amount && customer.more && customer.gift).map(e => {
            return {
              name: e.name,
              series: [
                {
                  name: "Gà bán",
                  value: e.amount
                },
                {
                  name: "Gà mua thêm",
                  value: e.name
                },
                {
                  name: "Gà tặng",
                  value: e.gift
                }
              ],
            };
          });
        } else if (search.option === OptionFilterEnum.DEBT) {
          const customers = await Promise.all(customerGroup.map(async e => {
            const customer = await this.prisma.customer.findUnique({
              where: {id: e.id},
              select: {
                lastName: true,
              }
            });
            const aggregate = await this.prisma.order.aggregate({
              where: {
                customerId: e.id,
                hide: true,
                total: {notIn: null},
                deliveredAt: {notIn: null}
              },
              _sum: {
                total: true
              }
            });
            return {
              name: customer.lastName,
              value: Number(aggregate._sum.total)
            };
          }));
          return customers.filter(customer => customer.value).map(e => {
            return {
              name: e.name,
              series: [
                {
                  name: e.name,
                  value: e.value,
                }
              ]
            };
          });
        } else if (search.option === OptionFilterEnum.ORDER) {
          throw new BadRequestException("Đang làm");
        } else if (search.option === OptionFilterEnum.ROUTE) {
          throw new BadRequestException("Đang làm");
        } else {
          throw new BadRequestException("Option unavailable. option for filter customer are: SOLD | SALES | DEBT");
        }
      }
      default: {
        throw new BadRequestException("filter không xác định");
      }
    }
  }
}
