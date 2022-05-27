import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateSalarySettingsDto} from './dto/create-salary-settings.dto';
import {UpdateSalarySettingsDto} from './dto/update-salary-settings.dto';
import {SalarySettingsRepository} from "./salary-settings.repository";
import {ProfileEntity} from "../../../../common/entities/profile.entity";
import {SearchSalarySettingsDto} from "./dto/search-salary-settings.dto";
import {SalaryType} from "@prisma/client";

@Injectable()
export class SalarySettingsService {
  constructor(private readonly repository: SalarySettingsRepository) {
  }

  async create(body: CreateSalarySettingsDto) {
    if (body.type === SalaryType.HOLIDAY && !body?.startedAt && !body.endedAt) {
      throw new BadRequestException("Ngày bắt đầu và kết thúc không được để trống");
    }
    const found = await this.repository.findOne({title: body?.title, settingType: body?.type});
    if (found && body?.prices?.length) {
      return await this.update(found.id, {prices: [...new Set(body.prices.concat(found.prices))]});
    }
    return await this.repository.create(this.mapToSalarySetting(body));
  }

  async findAll(profile: ProfileEntity, search: SearchSalarySettingsDto) {
    return await this.repository.findAll(profile, search);
  }

  async findOne(id: number) {
    return await this.repository.findById(id);
  }

  async update(id: number, updates: UpdateSalarySettingsDto) {
    return await this.repository.update(id, this.mapToSalarySetting(updates));
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }

  mapToSalarySetting(body: CreateSalarySettingsDto | UpdateSalarySettingsDto) {
    const totalOf = body?.totalOf?.length && body.totalOf.includes(SalaryType.BASIC) ? [SalaryType.BASIC, SalaryType.BASIC_INSURANCE] : body.totalOf;
    return {
      title: body.title,
      type: body.type,
      rate: body.rate,
      hasConstraints: body.hasConstraints,
      unit: body.unit,
      prices: body?.prices,
      totalOf: totalOf,
      workday: body?.workday,
      startedAt: body?.startedAt,
      endedAt: body?.endedAt,
      branchIds: body?.branchIds,
      employeeType: body?.employeeType,
      positionIds: body?.positionIds,
    };
  }
}
