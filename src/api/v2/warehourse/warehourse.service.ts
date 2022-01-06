import { Injectable } from '@nestjs/common';
import { CreateWarehourseDto } from './dto/create-warehourse.dto';
import { UpdateWarehourseDto } from './dto/update-warehourse.dto';

@Injectable()
export class WarehourseService {
  create(createWarehourseDto: CreateWarehourseDto) {
    return 'This action adds a new warehourse';
  }

  findAll() {
    return `This action returns all warehourse`;
  }

  findOne(id: number) {
    return `This action returns a #${id} warehourse`;
  }

  update(id: number, updateWarehourseDto: UpdateWarehourseDto) {
    return `This action updates a #${id} warehourse`;
  }

  remove(id: number) {
    return `This action removes a #${id} warehourse`;
  }
}
