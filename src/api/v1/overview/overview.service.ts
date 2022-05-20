import {BadRequestException, Injectable} from '@nestjs/common';
import {PrismaService} from "../../../prisma.service";
import {SearchHrOverviewDto} from "./dto/search-hr-overview.dto";
import {FilterTypeEntity} from "./entities/filter-type.entity";
import * as moment from "moment";
import {SearchSellOverviewDto} from "./dto/search-sell-overview.dto";
import {DELIVERY_STATUS, FilterSellEntity, OptionFilterEnum} from "./entities/filter-sell.entity";
import {beforeDatetime, firstDatetime, lastDatetime} from "../../../utils/datetime.util";
import {CustomerType} from '@prisma/client';
import {filterStatusNotNull} from "./functions/filter-numeric.func";

@Injectable()
export class OverviewService {
  constructor(private readonly prisma: PrismaService) {
  }

  async hr(search: SearchHrOverviewDto) {
    switch (search.filter) {
      case FilterTypeEntity.AGE: {
        return await this.overviewHrAge(search);
      }
      case FilterTypeEntity.CREATED_AT : {
        return await this.overviewHrCreatedAt(search);
      }
      default: {
        throw new BadRequestException("filter hr unavailable. filer include: AGE | CREATED_AT");
      }
    }
  }

  async sell(search: SearchSellOverviewDto) {
    switch (search.filter) {
      case FilterSellEntity.NATION: {
        return await this.overviewSellNation(search);
      }
      case FilterSellEntity.YEAR: {
        return await this.overviewSellYear(search);
      }
      case FilterSellEntity.MONTH: {
        return await this.overviewSellMonth(search);
      }
      case FilterSellEntity.CUSTOMER: {
        return await this.overviewSellCustomer(search);
      }
      default: {
        throw new BadRequestException("filter sell unavailable. filer include: NATION | YEAR | CUSTOMER");
      }
    }
  }

  private async overviewHrAge(search: SearchHrOverviewDto) {
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

  private async overviewHrCreatedAt(search: SearchHrOverviewDto) {
    const groupBy = [...new Set((await this.prisma.employee.groupBy({
      by: ["createdAt"],
      orderBy: {
        createdAt: "asc"
      }
    })).map(e => Number(moment(e.createdAt).format("YYYY"))))];
    return await Promise.all(groupBy.map(async e => {
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

  private async overviewSellNation(search: SearchSellOverviewDto) {
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
      return await this.nationSold(orderGroup, search);
    } else if (search.option === OptionFilterEnum.CUSTOMER) {
      return await this.nationCustomer(customerGroup);
    } else if (search.option === OptionFilterEnum.SALES) {
      return await this.nationSales(orderGroup);
    } else if (search.option === OptionFilterEnum.ORDER) {
      return await this.nationOrder(orderGroup);
    } else if (search.option === OptionFilterEnum.ROUTE) {
      return await this.nationRoute(orderGroup);
    } else {
      throw new BadRequestException("Option unavailable. option for filter NATION include: SOLD | SALES | CUSTOMER | ORDER | ROUTE");
    }
  }

  private async overviewSellYear(search: SearchSellOverviewDto) {
    const yearsOrder = [...new Set((await this.prisma.order.groupBy({
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

    const yearsCustomer = [...new Set((await this.prisma.customer.groupBy({
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

    const yearsRoute = [...new Set((await this.prisma.route.groupBy({
      by: ["startedAt"],
      orderBy: {
        startedAt: "asc"
      },
      where: {
        startedAt: search?.startedAt && search?.endedAt ? {
          gte: search.startedAt,
          lte: search.endedAt,
        } : {}
      }
    })).map(e => Number(moment(e.startedAt).format("YYYY"))))];

    if (search.option === OptionFilterEnum.CUSTOMER) {
      return await this.yearCustomer(yearsCustomer);
    } else if (search.option === OptionFilterEnum.SOLD) {
      return await this.yearSold(yearsOrder);
    } else if (search.option === OptionFilterEnum.SALES) {
      return await this.yearSales(yearsOrder);
    } else if (search.option === OptionFilterEnum.ORDER) {
      return await this.yearOrder(yearsOrder);
    } else if (search.option === OptionFilterEnum.ROUTE) {
      return await this.yearRoute(yearsRoute);
    } else {
      throw new BadRequestException("Option unavailable. option for filter YEAR are: SOLD | SALES | CUSTOMER | ORDER | ROUTE");
    }
  }

  private async overviewSellMonth(search: SearchSellOverviewDto) {
    const aggregate = await Promise.all([beforeDatetime(1, "months", search.datetime), search.datetime].map(async e => {
      return await this.prisma.order.aggregate({
        where: {
          deliveredAt: {
            gte: firstDatetime(e),
            lte: lastDatetime(e),
          }
        },
        _sum: {
          total: true,
        }
      });
    }));

    const count = await Promise.all([beforeDatetime(1, "months"), new Date()].map(async e => {
      return await this.prisma.order.count({
        where: {
          deliveredAt: {
            gte: firstDatetime(e),
            lte: lastDatetime(e),
          }
        }
      });
    }));

    const customer = await Promise.all([true, false].map(async isPotential => {
      return await this.prisma.customer.count({
        where: {isPotential}
      });
    }));

    return {
      datetime: search.datetime,
      order: {
        rate: ((count[1] - count[0]) / (count[0] + count[1])) * 100,
        total: count[0] + count[1],
        link: "http://localhost:4001/#/don-hang",
        income: {
          rate: ((aggregate[1]._sum.total - aggregate[0]._sum.total) / (aggregate[1]._sum.total + aggregate[0]._sum.total)) * 100,
          total: aggregate[1]._sum.total + aggregate[0]._sum.total,
          link: "http://localhost:4001/#/don-hang",
        }
      },
      customer: {
        potential: customer[0],
        total: customer[0] + customer[1],
        link: "",
      },
    };
  }

  private async overviewSellCustomer(search: SearchSellOverviewDto) {
    const customerGroup = await this.prisma.customer.groupBy({
      by: ['id'],
    });
    if (search.option === OptionFilterEnum.SALES) {
      return await this.customerSales(customerGroup);
    } else if (search.option === OptionFilterEnum.SOLD) {
      return await this.customerSold(customerGroup);
    } else if (search.option === OptionFilterEnum.DEBT) {
      return await this.customerDebt(customerGroup);
    } else if (search.option === OptionFilterEnum.ORDER) {
      return await this.customerOrder(customerGroup, search);
    } else if (search.option === OptionFilterEnum.ROUTE) {
      return await this.customerRoute(customerGroup, search);
    } else {
      throw new BadRequestException("Option unavailable. option for filter customer are: SOLD | SALES | DEBT | ORDER | ROUTE");
    }
  }

  private async nationSold(orderGroup: any, search: SearchSellOverviewDto) {
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
  }

  private async nationCustomer(customerGroup: any) {
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
  }

  private async nationSales(orderGroup: any) {
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
  }

  private async nationOrder(orderGroup: any) {
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
          name: status,
          value: count,
        };
      }));
      return {
        name: ward.district.province.name,
        series: series
      };
    }));
  }

  private async nationRoute(orderGroup: any) {
    const data = await Promise.all(orderGroup.map(async e => {
      const ward = await this.prisma.ward.findUnique({
        where: {id: e.wardId},
        select: {district: {select: {province: true}}}
      });
      return {
        name: ward.district.province.name,
        series: await Promise.all([DELIVERY_STATUS.COMPLETE, DELIVERY_STATUS.DELIVERY, DELIVERY_STATUS.CANCEL].map(async status => {
          return {
            name: status === DELIVERY_STATUS.COMPLETE ? "Hoàn thành" : status === DELIVERY_STATUS.DELIVERY ? "Đang giao" : "Đã hủy",
            value: Number(
              await this.prisma.route.count({
                where: {
                  deleted: status === DELIVERY_STATUS.CANCEL,
                  endedAt: status === DELIVERY_STATUS.COMPLETE ? {notIn: null} : status === DELIVERY_STATUS.DELIVERY ? {in: null} : {},
                  orders: {
                    some: {
                      wardId: e.wardId,
                    },
                  }
                },
              })
            ),
          };
        })),
      };
    }));
    return filterStatusNotNull(data);
  }

  private async yearCustomer(yearsCustomer: any) {
    return await Promise.all(yearsCustomer.map(async year => {
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
  }

  private async yearSold(yearsOrder: number[]) {
    return await Promise.all(yearsOrder.map(async year => {
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
  }

  private async yearSales(yearsOrder: number[]) {
    return await Promise.all(yearsOrder.map(async (year) => {
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
        return {
          name: isHide ? "Ẩn nợ" : "Doanh thu",
          value: b._sum.total || 0,
        };
      }));
      return {
        name: year.toString(),
        series: a
      };
    }));
  }

  private async yearOrder(yearsOrder: number[]) {
    return await Promise.all(yearsOrder.map(async year => {
      return {
        name: year,
        series: await Promise.all([DELIVERY_STATUS.COMPLETE, DELIVERY_STATUS.DELIVERY, DELIVERY_STATUS.CANCEL].map(async status => {
          return {
            name: status,
            value: await this.prisma.order.count({
              where: {
                deleted: status === DELIVERY_STATUS.CANCEL,
                createdAt: status === DELIVERY_STATUS.DELIVERY ? {
                  gte: firstDatetime(new Date(`${year}-01-01`), "years"),
                  lte: lastDatetime(new Date(`${year}-01-01`), "years"),
                } : {},
                deliveredAt: status === DELIVERY_STATUS.COMPLETE
                  ? {
                    notIn: null,
                    gte: firstDatetime(new Date(`${year}-01-01`), "years"),
                    lte: lastDatetime(new Date(`${year}-01-01`), "years"),
                  }
                  : status === DELIVERY_STATUS.DELIVERY
                    ? {in: null}
                    : {},
              }
            }),
          };
        })),
      };
    }));
  }

  private async yearRoute(yearsRoute: number[]) {
    return await Promise.all(yearsRoute.map(async year => {
      return {
        name: year,
        series: await Promise.all([DELIVERY_STATUS.COMPLETE, DELIVERY_STATUS.DELIVERY, DELIVERY_STATUS.CANCEL].map(async status => {
          return {
            name: status,
            value: await this.prisma.route.count({
              where: {
                deleted: status === DELIVERY_STATUS.CANCEL,
                startedAt: status === DELIVERY_STATUS.DELIVERY ? {
                  gte: firstDatetime(new Date(`${year}-01-01`), "years"),
                  lte: lastDatetime(new Date(`${year}-01-01`), "years"),
                } : {},
                endedAt: status === DELIVERY_STATUS.COMPLETE ? {
                  gte: firstDatetime(new Date(`${year}-01-01`), "years"),
                  lte: lastDatetime(new Date(`${year}-01-01`), "years"),
                } : status === DELIVERY_STATUS.DELIVERY ? {
                  in: null
                } : {}
              },
            }),
          };
        })),
      };
    }));
  }

  private async customerSales(customerGroup: { id: number }[]) {
    const a = await Promise.all(customerGroup.map(async e => {
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
        series: a.filter(e => e.value),
      };
    }));
    return a.filter(e => e.series.length);
  }

  private async customerSold(customerGroup: { id: number }[]) {
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
            value: e.more
          },
          {
            name: "Gà tặng",
            value: e.gift
          }
        ],
      };
    });
  }

  private async customerDebt(customerGroup: { id: number }[]) {
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
  }

  private async customerOrder(customerGroup: { id: number }[], search: SearchSellOverviewDto) {
    const data = await Promise.all(customerGroup.map(async e => {
      const customer = await this.prisma.customer.findUnique({where: {id: e.id}, select: {lastName: true}});
      return {
        name: customer.lastName,
        series: await Promise.all([DELIVERY_STATUS.COMPLETE, DELIVERY_STATUS.DELIVERY, DELIVERY_STATUS.CANCEL].map(async status => {
          return {
            name: status,
            value: await this.prisma.order.count({
              where: {
                customerId: e.id,
                deleted: status === DELIVERY_STATUS.CANCEL,
                deliveredAt: status === DELIVERY_STATUS.COMPLETE && search?.startedAt && search?.endedAt ? {
                  gte: search.startedAt,
                  lte: search.endedAt
                } : (status === DELIVERY_STATUS.DELIVERY && !(search?.startedAt && search?.endedAt)) || status === DELIVERY_STATUS.CANCEL ? {
                  in: null,
                } : {}
              }
            }),
          };
        })),
      };
    }));
    return filterStatusNotNull(data);
  }

  private async customerRoute(customerGroup: { id: number }[], search: SearchSellOverviewDto) {
    const data = await Promise.all(customerGroup.map(async e => {
      const customer = await this.prisma.customer.findUnique({where: {id: e.id}, select: {lastName: true}});
      return {
        name: customer.lastName,
        series: await Promise.all([DELIVERY_STATUS.COMPLETE, DELIVERY_STATUS.DELIVERY, DELIVERY_STATUS.CANCEL].map(async status => {
          return {
            name: status,
            value: await this.prisma.route.count({
              where: {
                id: e.id,
                deleted: status === DELIVERY_STATUS.CANCEL,
                endedAt: status === DELIVERY_STATUS.COMPLETE && search?.startedAt && search?.endedAt ? {
                  gte: search.startedAt,
                  lte: search.endedAt
                } : (status === DELIVERY_STATUS.DELIVERY && !(search?.startedAt && search?.endedAt)) || status === DELIVERY_STATUS.CANCEL ? {
                  in: null,
                } : {}
              }
            }),
          };
        })),
      };
    }));
    return filterStatusNotNull(data);
  }
}
