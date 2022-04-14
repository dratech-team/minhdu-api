import {BadRequestException, Injectable} from "@nestjs/common";
import {SalarySetting} from "@prisma/client";
import {BaseRepository} from "../../../../common/repository/base.repository";
import {PrismaService} from "../../../../prisma.service";
import {CreateSalarySettingsDto} from "./dto/create-salary-settings.dto";
import {UpdateSalarySettingsDto} from "./dto/update-salary-settings.dto";
import {SearchSalarySettingsDto} from "./dto/search-salary-settings.dto";
import {ProfileEntity} from "../../../../common/entities/profile.entity";

@Injectable()
export class SalarySettingsRepository extends BaseRepository<SalarySetting, any> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(body: CreateSalarySettingsDto) {
    try {
      return await this.prisma.salarySetting.create({
        data: {
          title: body.title,
          type: body.settingType,
          rate: body.rate,
          workday: body?.workday,
          price: body?.price,
          types: body?.types || undefined,
          constraints: body?.constraints || undefined
        }
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
        this.prisma.salarySetting.count(),
        this.prisma.salarySetting.findMany({
          // take: search?.take,
          // skip: search?.skip,
          where: {
            type: {in: search?.salaryType}
          }
        }),
      ]);
      return {total, data};
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.salarySetting.findUnique({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdateSalarySettingsDto) {
    try {
      return await this.prisma.salarySetting.update({
        where: {id},
        data: {
          title: updates.title,
          type: updates.settingType,
          rate: updates.rate,
          constraints: {set: updates.constraints}
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

  async migrate() {
    try {
      const templates = await this.prisma.basicTemplate.findMany();
      await Promise.all(templates.map(async (template) => {
        return await this.prisma.salarySetting.create({
          data: {
            title: template.title,
            type: template.type,
            rate: 1,
          }
        });
      }));
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
