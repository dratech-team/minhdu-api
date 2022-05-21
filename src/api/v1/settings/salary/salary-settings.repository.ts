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

@Injectable()
export class SalarySettingsRepository extends BaseRepository<SalarySetting> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(body: CreateSalarySettingsDto) {
    try {
      return await this.prisma.salarySetting.create({
        data: body
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

      const positions = _.flattenDeep(acc.branches.map(branch => branch.positions.map(position => position.id)));

      // use for holiday to get datetime
      const payroll = search?.payrollId ? await this.prisma.payroll.findUnique({where: {id: search?.payrollId}}) : null;

      const [total, data] = await Promise.all([
        this.prisma.salarySetting.count({
          where: {
            type: {in: search?.types},
            startedAt: payroll?.createdAt ? {gte: payroll?.createdAt} : {},
            endedAt: payroll?.createdAt ? {
              gte: payroll?.createdAt,
              lte: lastDatetime(payroll?.createdAt)
            } : {},
            branches: acc.branches?.length ? {some: {id: {in: acc.branches.map(branch => branch.id)}}} : {},
            positions: positions.length ? {some: {id: {in: positions}}} : {},
          }
        }),
        this.prisma.salarySetting.findMany({
          take: search?.take,
          skip: search?.skip,
          where: {
            type: {in: search?.types},
            startedAt: payroll?.createdAt ? {gte: payroll?.createdAt} : {},
            endedAt: payroll?.createdAt ? {
              gte: payroll?.createdAt,
              lte: lastDatetime(payroll?.createdAt)
            } : {},
            branches: acc.branches?.length ? {some: {id: {in: acc.branches.map(branch => branch.id)}}} : {},
            positions: positions.length ? {some: {id: {in: positions}}} : {},
          }
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
        where: {title_type: {title: search.title, type: search.settingType}}
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdateSalarySettingsDto) {
    try {
      return await this.prisma.salarySetting.update({
        where: {id},
        data: updates,
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
