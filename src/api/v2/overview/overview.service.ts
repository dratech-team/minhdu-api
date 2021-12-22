import {PrismaService} from "../../../prisma.service";
import {CreateOverviewDto} from "./dto/create-overview.dto";
import {UpdateOverviewDto} from "./dto/update-overview.dto";
import {BadRequestException} from "@nestjs/common";
import {OverviewFilterEnum} from "./entities/overview-filter.enum";
import {firstDatetime, lastDatetime} from "../../../utils/datetime.util";
import {SearchHROverviewDto} from "./dto/search-h-r-overview.dto";
import * as moment from "moment";

export class OverviewService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateOverviewDto) {
    return 'This action adds a new hrOverview';
  }

  async findAll(search: SearchHROverviewDto) {
    try {
      switch (search.filter) {
        case OverviewFilterEnum.AGE: {
          const ages = (await this.prisma.employee.groupBy({
            by: ['birthday'],
            orderBy: {
              birthday: "asc"
            }
          })).map(birthday => moment().diff(birthday.birthday, "years"));
          console.log(ages)
          break;
        }
        case OverviewFilterEnum.CREATED_AT: {
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

  update(id: number, updates: UpdateOverviewDto) {
    return `This action updates a #${id} hrOverview`;
  }

  remove(id: number) {
    return `This action removes a #${id} hrOverview`;
  }
}
