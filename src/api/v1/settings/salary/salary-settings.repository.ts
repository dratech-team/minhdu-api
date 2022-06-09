import {BadRequestException, Injectable} from "@nestjs/common";
import {SalarySetting} from "@prisma/client";
import {BaseRepository} from "../../../../common/repository/base.repository";
import {PrismaService} from "../../../../prisma.service";
import {CreateSalarySettingsDto} from "./dto/create-salary-settings.dto";
import {UpdateSalarySettingsDto} from "./dto/update-salary-settings.dto";
import {SearchSalarySettingsDto} from "./dto/search-salary-settings.dto";
import {ProfileEntity} from "../../../../common/entities/profile.entity";
import {SearchOneSalarySettingsDto} from "./dto/search-one-salary-settings.dto";
import {lastDatetime} from "../../../../utils/datetime.util";
import * as _ from "lodash";
import {SortSalarySettingsEnum} from "./enums/sort-salary-settings.enum";

@Injectable()
export class SalarySettingsRepository extends BaseRepository<SalarySetting> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(body: CreateSalarySettingsDto) {
    try {
      return await this.prisma.salarySetting.create({
        data: {
          title: body.title,
          type: body.type,
          rate: body.rate,
          rateConditionId: body.rateConditionId,
          hasConstraints: body.hasConstraints,
          unit: body.unit,
          prices: body?.prices,
          totalOf: body?.totalOf,
          workday: body?.workday,
          startedAt: body?.startedAt,
          endedAt: body?.endedAt,
          employeeType: body.employeeType,
          branches: {connect: body.branchIds?.map(id => ({id}))},
          positions: {connect: body.positionIds?.map(id => ({id}))},
        },
        include: {
          branches: true,
          positions: true
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(profile: ProfileEntity, search: SearchSalarySettingsDto) {
    try {
      const acc = await this.prisma.account.findUnique({
        where: {id: profile.id},
        include: {branches: {include: {positions: true}}}
      });

      const positions = _.flattenDeep(acc?.branches?.map(branch => branch.positions?.map(position => position.id)));

      // use for holiday to get datetime
      const payroll = search?.payrollId ? await this.prisma.payroll.findUnique({where: {id: search?.payrollId}}) : null;

      const [total, data] = await Promise.all([
        this.prisma.salarySetting.count({
          where: {
            title: {contains: search?.search, mode: "insensitive"},
            type: {in: search?.types},
            startedAt: payroll?.createdAt ? {gte: payroll?.createdAt} : {},
            endedAt: payroll?.createdAt ? {
              gte: payroll?.createdAt,
              lte: lastDatetime(payroll?.createdAt)
            } : {},
            branches: acc?.branches?.length ? {some: {id: {in: acc.branches.map(branch => branch.id)}}} : {},
            positions: positions.length ? {some: {id: {in: positions}}} : {},
          },
        }),
        this.prisma.salarySetting.findMany({
          take: search?.take,
          skip: search?.skip,
          where: {
            title: {contains: search?.search, mode: "insensitive"},
            type: {in: search?.types},
            startedAt: payroll?.createdAt ? {gte: payroll?.createdAt} : {},
            endedAt: payroll?.createdAt ? {
              gte: payroll?.createdAt,
              lte: lastDatetime(payroll?.createdAt)
            } : {},
            branches: acc?.branches?.length ? {some: {id: {in: acc.branches.map(branch => branch.id)}}} : {},
            positions: positions.length ? {some: {id: {in: positions}}} : {},
          },
          include: {
            branches: true,
            positions: true
          },
          orderBy: search?.orderBy && search?.orderType
            ? search.orderBy === SortSalarySettingsEnum.TITLE
              ? {title: search.orderType}
              : search.orderBy === SortSalarySettingsEnum.PRICE
                ? {prices: search.orderType}
                : search.orderBy === SortSalarySettingsEnum.UNIT
                  ? {unit: search.orderType}
                  : search.orderBy === SortSalarySettingsEnum.DATETIME
                    ? {startedAt: search.orderType}
                    : search.orderBy === SortSalarySettingsEnum.RATE
                      ? {rate: search.orderType}
                      : search.orderBy === SortSalarySettingsEnum.TYPE
                        ? {type: search.orderType}
                        : {}
            : {title: "asc"}
        }),
      ]);
      return {total, data};
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findById(id: number) {
    try {
      return await this.prisma.salarySetting.findUnique({
        where: {id}
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(search: SearchOneSalarySettingsDto) {
    try {
      return await this.prisma.salarySetting.findUnique({
        where: {title_type: {title: search.title, type: search.settingType}},
        include: {
          branches: true,
          positions: true
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, body: UpdateSalarySettingsDto) {
    try {
      return await this.prisma.salarySetting.update({
        where: {id},
        data: {
          title: body.title,
          type: body.type,
          rate: body.rate,
          rateConditionId: body.rateConditionId,
          hasConstraints: body.hasConstraints,
          unit: body.unit,
          prices: body?.prices,
          totalOf: body?.totalOf,
          workday: body?.workday,
          startedAt: body?.startedAt,
          endedAt: body?.endedAt,
          employeeType: body.employeeType,
          branches: {connect: body.branchIds?.map(id => ({id}))},
          positions: {connect: body.positionIds?.map(id => ({id}))},
        },
        include: {
          branches: true,
          positions: true
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.salarySetting.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
