import {Injectable} from '@nestjs/common';
import {Position} from '@prisma/client';
import {CreatePositionDto} from './dto/create-position.dto';
import {UpdatePositionDto} from './dto/update-position.dto';
import {PositionRepository} from "./position.repository";

@Injectable()
export class PositionService {
  constructor(private readonly repository: PositionRepository) {
  }

  async create(body: CreatePositionDto): Promise<Position> {
    return this.repository.create(body);
  }

  async findAll(): Promise<any> {
    return this.repository.findAll();
  }

  async findOne(id: number) {
    return this.repository.findOne(id);
  }

  update(id: number, updates: UpdatePositionDto) {
    return this.repository.update(id, updates);
  }

  async remove(id: number) {
    return this.repository.remove(id);
  }
}
