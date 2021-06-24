import {Injectable} from '@nestjs/common';
import {Position} from '@prisma/client';
import {CreatePositionDto} from './dto/create-position.dto';
import {UpdatePositionDto} from './dto/update-position.dto';
import {PositionRepository} from "./position.repository";
import {BasePositionService} from "./base-position.service";

@Injectable()
export class PositionService implements BasePositionService {
  constructor(private readonly repository: PositionRepository) {
  }

  async create(body: CreatePositionDto): Promise<Position> {
    return this.repository.create(body);
  }

  async findAll(): Promise<Position[]> {
    return this.repository.findAll();
  }

  findBy(query: any): Promise<Position[]> {
    throw new Error('Method not implemented.');
  }

  findBranch(id: number): Promise<any> {
    return this.repository.findBranch(id);
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
