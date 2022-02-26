import { Injectable } from '@nestjs/common';
import { CreateIncubatorDto } from './dto/create-incubator.dto';
import { UpdateIncubatorDto } from './dto/update-incubator.dto';

@Injectable()
export class IncubatorService {
  create(createIncubatorDto: CreateIncubatorDto) {
    return 'This action adds a new incubator';
  }

  findAll() {
    return `This action returns all incubator`;
  }

  findOne(id: number) {
    return `This action returns a #${id} incubator`;
  }

  update(id: number, updateIncubatorDto: UpdateIncubatorDto) {
    return `This action updates a #${id} incubator`;
  }

  remove(id: number) {
    return `This action removes a #${id} incubator`;
  }
}
