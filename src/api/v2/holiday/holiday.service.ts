import {Injectable} from '@nestjs/common';
import {CreateHolidayDto} from './dto/create-holiday.dto';
import {UpdateHolidayDto} from './dto/update-holiday.dto';
import {HolidayRepository} from "./holiday.repository";
import {SearchHolidayDto} from "./dto/search-holiday.dto";

@Injectable()
export class HolidayService {
  constructor(private readonly repository: HolidayRepository) {
  }

  async create(body: CreateHolidayDto) {
    return await this.repository.create(body);
  }

  async findAll(take: number, skip: number, search: Partial<SearchHolidayDto>) {
    return await this.repository.findAll(take, skip, search);
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateHolidayDto) {
    /// TODO: Nếu sửa hệ số ngày lễ thì sẽ ảnh hưởng tới các khoản lương trước đó. Cân nhắc có nên cho sửa hay k.?
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }
}
