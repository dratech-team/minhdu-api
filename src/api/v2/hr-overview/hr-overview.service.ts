import {PrismaService} from "../../../prisma.service";
import {CreateHrOverviewDto} from "./dto/create-hr-overview.dto";
import {UpdateHrOverviewDto} from "./dto/update-hr-overview.dto";
import {BadRequestException} from "@nestjs/common";
import {HrOverviewFilterEnum} from "./entities/hr-overview-filter.enum";
import {firstDatetime, lastDatetime} from "../../../utils/datetime.util";
import {SearchHrOverviewDto} from "./dto/search-hr-overview.dto";
import * as moment from "moment";

export class HrOverviewService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateHrOverviewDto) {
    return 'This action adds a new hrOverview';
  }

  async findAll(search: SearchHrOverviewDto) {
    try {
      switch (search.filter) {
        case HrOverviewFilterEnum.AGE: {
          const ages = (await this.prisma.employee.groupBy({
            by: ['birthday'],
            orderBy: {
              birthday: "asc"
            }
          })).map(birthday => moment().diff(birthday.birthday, "years"));
          console.log(ages)
          break;
        }
        case HrOverviewFilterEnum.CREATED_AT: {
          const datetimes = await this.prisma.employee.groupBy({
            by: ['createdAt'],
            orderBy: {
              createdAt: "asc"
            }
          });
          return await Promise.all(datetimes.map(async datetime => {
            return await this.prisma.employee.findMany({
              where: {
                leftAt: search.isLeft ? {in: null} : {not: null},
                createdAt: {
                  gte: firstDatetime(datetime.createdAt, "years"),
                  lte: lastDatetime(datetime.createdAt, "years"),
                }
              },
            });
          }));
        }
      }
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} hrOverview`;
  }

  update(id: number, updates: UpdateHrOverviewDto) {
    return `This action updates a #${id} hrOverview`;
  }

  remove(id: number) {
    return `This action removes a #${id} hrOverview`;
  }
}
