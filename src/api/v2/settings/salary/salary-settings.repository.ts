import {BadRequestException, Injectable} from "@nestjs/common";
import {SalarySetting, SalaryType} from "@prisma/client";
import {BaseRepository} from "../../../../common/repository/base.repository";
import {PrismaService} from "../../../../prisma.service";
import {CreateSalarySettingsDto} from "./dto/create-salary-settings.dto";
import {UpdateSalarySettingsDto} from "./dto/update-salary-settings.dto";
import {SearchSalarySettingsDto} from "./dto/search-salary-settings.dto";
import {ProfileEntity} from "../../../../common/entities/profile.entity";
import {SearchOneSalarySettingsDto} from "./dto/search-one-salary-settings.dto";

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
      const acc = await this.prisma.account.findUnique({where: {id: profile.id}});

      const [total, data] = await Promise.all([
        this.prisma.salarySetting.count({
          where: {
            type: {in: search?.types}
          }
        }),
        this.prisma.salarySetting.findMany({
          take: search?.take,
          skip: search?.skip,
          where: {
            type: {in: search?.types},
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
