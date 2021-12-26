import {Injectable} from '@nestjs/common';
import {PrismaService} from "../../../prisma.service";
import {SearchHrOverviewDto} from "./dto/search-hr-overview.dto";
import {FilterTypeEntity} from "./entities/filter-type.entity";
import * as moment from "moment";
import {SearchSellOverviewDto} from "./dto/search-sell-overview.dto";

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

    console.log(data);
  }
}
