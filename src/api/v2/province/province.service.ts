import { Injectable } from '@nestjs/common';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
import {ProvinceRepository} from "./province.repository";

@Injectable()
export class ProvinceService {
  constructor(private readonly repository: ProvinceRepository) {
  }
  create(createProvinceDto: CreateProvinceDto) {
    return this.repository.create(createProvinceDto);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} province`;
  }

  update(id: number, updateProvinceDto: UpdateProvinceDto) {
    return `This action updates a #${id} province`;
  }

  remove(id: number) {
    return `This action removes a #${id} province`;
  }
}
