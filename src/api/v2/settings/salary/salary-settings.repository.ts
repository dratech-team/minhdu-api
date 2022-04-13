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
          type: body.salaryType,
          price: body.price,
          rate: body.rate,
          reference: body.reference,
          constraints: {set: body.constraints}
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
          take: search?.take,
          skip: search?.skip,
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
      return 'This action adds a new salary';
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdateSalarySettingsDto) {
    try {
      return 'This action adds a new salary';
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return 'This action adds a new salary';
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
