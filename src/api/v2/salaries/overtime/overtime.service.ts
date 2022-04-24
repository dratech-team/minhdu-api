import {Injectable} from '@nestjs/common';
import {CreateMultipleOvertimeDto} from './dto/create-multiple-overtime.dto';
import {UpdateOvertimeDto} from './dto/update-overtime.dto';
import {OvertimeRepository} from "./overtime.repository";
import {CreateOvertimeDto} from "./dto/create-overtime.dto";
import {DeleteMultipleOvertimeDto} from "./dto/delete-multiple-overtime.dto";
import {UpdateMultipleOvertimeDto} from "./dto/update-multiple-overtime.dto";
import {SalarySettingsService} from "../../settings/salary/salary-settings.service";
import {DatetimeUnit} from '@prisma/client';
import {crudManyResponse} from "../base/functions/response.function";
import * as _ from 'lodash';

@Injectable()
export class OvertimeService {
  constructor(
    private readonly repository: OvertimeRepository,
    private readonly salarySettingsService: SalarySettingsService,
  ) {
  }

  async create(body: CreateMultipleOvertimeDto) {
    return this.repository.create(body);
  }

  async createMany(body: CreateMultipleOvertimeDto) {
    const overtimes = await Promise.all(body.payrollIds.map(async payrollId => {
      return await this.mapToOvertime(Object.assign(_.omit(body, "payrollIds"), {payrollId}));
    })) as CreateOvertimeDto[];
    const {count} = await this.repository.createMany(overtimes);
    return crudManyResponse(count, "creation");
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    return this.repository.findOne(id);
  }

  async update(id: number, body: UpdateOvertimeDto) {
    return this.repository.update(id, body);
  }

  async updateMany(body: UpdateMultipleOvertimeDto) {
    const {count} = await this.repository.updateMany(body.salaryIds, await this.mapToOvertime(body));
    return crudManyResponse(count, "updation");
  }

  async remove(id: number) {
    return this.repository.remove(id);
  }

  async removeMany(body: DeleteMultipleOvertimeDto) {
    const {count} = await this.repository.removeMany(body);
    return crudManyResponse(count, "deletion");
  }

  private async mapToOvertime(body): Promise<CreateOvertimeDto> {
    const setting = await this.salarySettingsService.findOne(body.settingId);
    return {
      payrollId: body.payrollId,
      startedAt: body.startedAt,
      endedAt: body.endedAt,
      startTime: setting.unit === DatetimeUnit.HOUR ? body.startTime : null,
      endTime: setting.unit === DatetimeUnit.HOUR ? body.endTime : null,
      settingId: body.settingId,
      blockId: body?.blockId || 4,
      allowances: body.allowances,
    };
  }
}
