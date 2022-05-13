import {Injectable} from '@nestjs/common';
import {CreateDayoffDto} from './dto/create-dayoff.dto';
import {UpdateDayoffDto} from './dto/update-dayoff.dto';
import {DayoffRepository} from "./dayoff.repository";

@Injectable()
export class DayoffService {
  constructor(private readonly repository: DayoffRepository) {
  }

  create(createDayoffDto: CreateDayoffDto) {
    return 'This action adds a new dayoff';
  }

  findAll() {
    return `This action returns all dayoff`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dayoff`;
  }

  update(id: number, updateDayoffDto: UpdateDayoffDto) {
    return `This action updates a #${id} dayoff`;
  }

  remove(id: number) {
    return `This action removes a #${id} dayoff`;
  }
}
