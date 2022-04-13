import {Injectable} from '@nestjs/common';
import {CreateSalarySettingsDto} from './dto/create-salary-settings.dto';
import {UpdateSalarySettingsDto} from './dto/update-salary-settings.dto';
import {SalarySettingsRepository} from "./salary-settings.repository";
import {ProfileEntity} from "../../../../common/entities/profile.entity";
import {SearchSalarySettingsDto} from "./dto/search-salary-settings.dto";

@Injectable()
export class SalarySettingsService {
  constructor(private readonly repository: SalarySettingsRepository) {
  }

  async create(body: CreateSalarySettingsDto) {
    return await this.repository.create(body);
  }

  async findAll(profile: ProfileEntity, search: SearchSalarySettingsDto) {
    return await this.repository.findAll(profile, search);
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateSalarySettingsDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }

  async migrate() {
    return await this.repository.migrate();
  }
}
