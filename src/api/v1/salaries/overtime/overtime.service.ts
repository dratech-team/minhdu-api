import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateManyOvertimeDto} from './dto/create-many-overtime.dto';
import {UpdateOvertimeDto} from './dto/update-overtime.dto';
import {OvertimeRepository} from "./overtime.repository";
import {CreateOvertimeDto} from "./dto/create-overtime.dto";
import {RemoveManyOvertimeDto} from "./dto/remove-many-overtime.dto";
import {UpdateManyOvertimeDto} from "./dto/update-many-overtime.dto";
import {SalarySettingsService} from "../../settings/salary/salary-settings.service";
import {DatetimeUnit} from '@prisma/client';
import {crudManyResponse} from "../base/functions/response.function";
import * as _ from 'lodash';
import {SearchOvertimeDto} from "./dto/search-overtime.dto";

@Injectable()
export class OvertimeService {
  constructor(
    private readonly repository: OvertimeRepository,
    private readonly salarySettingsService: SalarySettingsService,
  ) {
  }

  async create(body: CreateManyOvertimeDto) {
    return this.repository.create(await this.mapToOvertime(body));
  }

  async createMany(body: CreateManyOvertimeDto) {
    const overtimes = await Promise.all(body.payrollIds.map(async payrollId => {
      return await this.mapToOvertime(Object.assign(_.omit(body, "payrollIds"), {payrollId}));
    })) as CreateOvertimeDto[];
    const {count} = await this.repository.createMany(overtimes);
    return crudManyResponse(count, "creation");
  }

  async findAll(search?: Partial<SearchOvertimeDto>) {
    if (!search?.startedAt || !search?.endedAt) {
      throw new BadRequestException("Tăng ca thì truyền ngày bắt đầu và kết thúc vào");
    }
    return this.repository.findAll(search);
  }

  async count(search?: Partial<SearchOvertimeDto>) {
    return this.repository.count(search);
  }

  async findOne(id: number) {
    return this.repository.findOne(id);
  }

  async groupBy(search: Partial<SearchOvertimeDto>) {
    return this.repository.groupBy(search);
  }

  async update(id: number, body: UpdateOvertimeDto) {
    return this.repository.update(id, body);
  }

  async updateMany(body: UpdateManyOvertimeDto) {
    const {count} = await this.repository.updateMany(body.salaryIds, await this.mapToOvertime(body));
    return crudManyResponse(count, "updation");
  }

  async remove(id: number) {
    return this.repository.remove(id);
  }

  async removeMany(body: RemoveManyOvertimeDto) {
    const {count} = await this.repository.removeMany(body);
    return crudManyResponse(count, "deletion");
  }

  private async mapToOvertime(body): Promise<CreateOvertimeDto> {
    const setting = body.settingId ? await this.salarySettingsService.findOne(body.settingId) : null;
    return {
      payrollId: body.payrollId,
      startedAt: body.startedAt,
      endedAt: body.endedAt,
      startTime: setting?.unit === DatetimeUnit.HOUR ? body.startTime : null,
      endTime: setting?.unit === DatetimeUnit.HOUR ? body.endTime : null,
      settingId: body.settingId,
      blockId: body?.blockId || 4,
      partial: body.partial,
      allowances: body.allowances,
      note: body.note,
    };
  }
}
