import { Injectable } from '@nestjs/common';
import { CreateWarehourseTypeDto } from './dto/create-warehourse-type.dto';
import { UpdateWarehourseTypeDto } from './dto/update-warehourse-type.dto';

@Injectable()
export class WarehourseTypeService {
  create(createWarehourseTypeDto: CreateWarehourseTypeDto) {
    return 'This action adds a new warehourseType';
  }

  findAll() {
    return `This action returns all warehourseType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} warehourseType`;
  }

  update(id: number, updateWarehourseTypeDto: UpdateWarehourseTypeDto) {
    return `This action updates a #${id} warehourseType`;
  }

  remove(id: number) {
    return `This action removes a #${id} warehourseType`;
  }
}
