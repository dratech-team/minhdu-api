import {Injectable} from '@nestjs/common';
import {CreateHolidayDto} from './dto/create-holiday.dto';
import {UpdateHolidayDto} from './dto/update-holiday.dto';
import {HolidayRepository} from './holiday.repository';
import {CreateManyHolidayDto} from "./dto/create-many-holiday.dto";
import {UpdateManyHolidayDto} from "./dto/update-many-holiday.dto";
import {crudManyResponse} from "../base/functions/response.function";
import {RemoveManyHolidayDto} from "./dto/remove-many-holiday.dto";

@Injectable()
export class HolidayService {
  constructor(private readonly repository: HolidayRepository) {
  }

  create(body: CreateHolidayDto) {
    return this.repository.create(body);
  }

  async createMany(body: CreateManyHolidayDto) {
    const holidays = body.payrollIds.map(payrollId => this.mapToHoliday(Object.assign(body, {payrollId})));
    const {count} = await this.repository.createMany(holidays);
    return crudManyResponse(count, "creation");
  }

  findAll() {
    return `This action returns all holiday`;
  }

  findOne(id: number) {
    return `This action returns a #${id} holiday`;
  }

  update(id: number, updates: UpdateHolidayDto) {
    return this.repository.update(id, updates);
  }

  async updateMany(body: UpdateManyHolidayDto) {
    const {count} = await this.repository.updateMany(body.salaryIds, this.mapToHoliday(body));
    return crudManyResponse(count, "updation");
  }

  remove(id: number) {
    return this.repository.remove(id);
  }

  async removeMany(body: RemoveManyHolidayDto) {
    const {count} = await this.repository.removeMany(body);
    return crudManyResponse(count, "deletion");
  }

  mapToHoliday(body): CreateHolidayDto {
    return {
      payrollId: body.payrollId,
      settingId: body.settingId,
      note: body?.note,
      blockId: body?.blockId || 7
    };
  }
}
