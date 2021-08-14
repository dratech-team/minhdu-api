import {Injectable} from '@nestjs/common';
import {CreateMaterialDto} from './dto/create-material.dto';
import {UpdateMaterialDto} from './dto/update-material.dto';
import {MaterialRepository} from "./material.repository";

@Injectable()
export class MaterialService {
  constructor(private readonly repository: MaterialRepository) {
  }

  async create(body: CreateMaterialDto) {
    return await this.repository.create(body);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateMaterialDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }
}
