import {PrismaService} from "../../../prisma.service";
import {CreateHrOverviewDto} from "./dto/create-hr-overview.dto";
import {UpdateHrOverviewDto} from "./dto/update-hr-overview.dto";
import {BadRequestException} from "@nestjs/common";
import {HrOverviewFilterEnum} from "./entities/hr-overview-filter.enum";
import {rangeDatetime} from "../../../utils/datetime.util";
import * as moment from "moment";

export class HrOverviewRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateHrOverviewDto) {
    return 'This action adds a new hrOverview';
  }

  async findAll(filter: HrOverviewFilterEnum, isLeft: boolean) {
    const years = rangeDatetime(new Date("1960-01-01"), new Date(), "years").map(date => date.year());
    try {
      switch (filter) {
        case HrOverviewFilterEnum.AGE: {
          break;
        }
        case HrOverviewFilterEnum.CREATED_AT: {
          return await this.prisma.employee.findMany({
            where: {
              leftAt: isLeft ? {in: null} : {not: null},
            },
            select: {

            },
            orderBy: {

            }
          });
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
