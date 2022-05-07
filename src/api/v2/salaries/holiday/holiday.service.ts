import { Injectable } from '@nestjs/common';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { UpdateHolidayDto } from './dto/update-holiday.dto';
import { HolidayRepository } from './holiday.repository';

@Injectable()
export class HolidayService {
  constructor(private readonly repository: HolidayRepository) {
  }

  create(createHolidayDto: CreateHolidayDto) {
    return 'This action adds a new holiday';
  }

  findAll() {
    return `This action returns all holiday`;
  }

  findOne(id: number) {
    return `This action returns a #${id} holiday`;
  }

  update(id: number, updateHolidayDto: UpdateHolidayDto) {
    return `This action updates a #${id} holiday`;
  }

  remove(id: number) {
    return `This action removes a #${id} holiday`;
  }
}
