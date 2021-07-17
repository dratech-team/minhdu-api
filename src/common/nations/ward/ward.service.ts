import {Injectable} from '@nestjs/common';
import {CreateWardDto} from './dto/create-ward.dto';
import {UpdateWardDto} from './dto/update-ward.dto';
import {WardRepository} from "./ward.repository";

@Injectable()
export class WardService {
  constructor(private readonly repository: WardRepository) {
  }

  create(createWardDto: CreateWardDto) {
    return this.repository.create(createWardDto);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  update(id: number, updateWardDto: UpdateWardDto) {
    return `This action updates a #${id} ward`;
  }

  remove(id: number) {
    return `This action removes a #${id} ward`;
  }
}
