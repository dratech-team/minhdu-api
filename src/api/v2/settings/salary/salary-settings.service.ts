import {Injectable} from '@nestjs/common';
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
    const types = body.types.includes(SalaryType.BASIC) ? [SalaryType.BASIC, SalaryType.BASIC_INSURANCE] : body.types;
    return await this.repository.create(Object.assign(body, {types}));
  }

  async findAll(profile: ProfileEntity, search: SearchSalarySettingsDto) {
    return await this.repository.findAll(profile, search);
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateSalarySettingsDto) {
    const types = updates.types.includes(SalaryType.BASIC) ? [SalaryType.BASIC, SalaryType.BASIC_INSURANCE] : updates.types;
    return await this.repository.update(id, Object.assign(updates, {types}));
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }

  async migrate() {
    return await this.repository.migrate();
  }
}
