import {Injectable} from '@nestjs/common';
import {PrismaService} from "../../../prisma.service";
import {SearchHrOverviewDto} from "./dto/search-hr-overview.dto";
import {FilterTypeEntity} from "./entities/filter-type.entity";
import * as moment from "moment";

@Injectable()
export class OverviewService {
  constructor(private readonly prisma: PrismaService) {
  }

  async findAll(search: SearchHrOverviewDto) {
    switch (search.filter) {
      case FilterTypeEntity.AGE: {
        const ages = (await this.prisma.employee.groupBy({
          by: ["birthday"],
          orderBy: {
            birthday: "asc"
          }
        })).map(e => moment().diff(e.birthday, "years"));

        const uniqueAges = [...new Set(ages)];
        const a = uniqueAges.map(age => {
          const newAge = ages.filter(e => e === age);
          return {
            key: age,
            value: newAge.length / uniqueAges.length,
          };
        });
        console.log(a.map(e => e.value).reduce((a, b) => a + b, 0))
        // return await Promise.all(ages.map(async age => {
        //   return await this.prisma.employee.aggregate({
        //     where
        //   });
        // }));
      }
    }
  }
}
