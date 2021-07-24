import {Injectable} from '@nestjs/common';
import {CreateHolidayDto} from './dto/create-holiday.dto';
import {UpdateHolidayDto} from './dto/update-holiday.dto';
import {HolidayRepository} from "./holiday.repository";

@Injectable()
export class HolidayService {
  constructor(private readonly repository: HolidayRepository) {
  }

  async create(body: CreateHolidayDto) {
    return await this.repository.create(body);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateHolidayDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }
}
