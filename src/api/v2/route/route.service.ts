import {Injectable} from '@nestjs/common';
import {CreateRouteDto} from './dto/create-route.dto';
import {UpdateRouteDto} from './dto/update-route.dto';
import {RouteRepository} from "./route.repository";

@Injectable()
export class RouteService {
  constructor(private readonly repository: RouteRepository) {
  }

  async create(body: CreateRouteDto) {
    return await this.repository.create(body);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateRouteDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }
}
