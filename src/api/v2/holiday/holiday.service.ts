import {Injectable} from '@nestjs/common';
import {CreateHolidayDto} from './dto/create-holiday.dto';
import {UpdateHolidayDto} from './dto/update-holiday.dto';
import {HolidayRepository} from "./holiday.repository";
import {SearchHolidayDto} from "./dto/search-holiday.dto";
import {Position} from "@prisma/client";
import {ProfileEntity} from "../../../common/entities/profile.entity";

@Injectable()
export class HolidayService {
  constructor(private readonly repository: HolidayRepository) {
  }

  async create(body: CreateHolidayDto) {
    return await this.repository.create(body);
  }

  async findAll(profile: ProfileEntity, search: Partial<SearchHolidayDto>) {
    return await this.repository.findAll(profile, search);
  }

  async findOne(id: number, search?: Partial<SearchHolidayDto>) {
    const found = await this.repository.findOne(id, search);
    return Object.assign(found.holiday, {employees: found.salaries.map(salary => Object.assign({}, salary.payroll.employee, {salary: salary}))});
  }

  async update(id: number, updates: UpdateHolidayDto) {
    /// TODO: Nếu sửa hệ số ngày lễ thì sẽ ảnh hưởng tới các khoản lương trước đó. Cân nhắc có nên cho sửa hay k.?
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }

  export() {

  }
}
