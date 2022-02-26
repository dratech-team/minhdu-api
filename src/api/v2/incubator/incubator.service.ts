import { Injectable } from '@nestjs/common';
import { CreateIncubatorDto } from './dto/create-incubator.dto';
import { UpdateIncubatorDto } from './dto/update-incubator.dto';
import {IncubatorRepository} from "./incubator.repository";
import {SearchIncubatorDto} from "./dto/search-incubator.dto";

@Injectable()
export class IncubatorService {
  constructor(private readonly repository: IncubatorRepository) {
  }

 async create(body: CreateIncubatorDto) {
    return await this.repository.create(body);
  }

  async findAll(search: SearchIncubatorDto) {
    return await this.repository.findAll(search);
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateIncubatorDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }
}
