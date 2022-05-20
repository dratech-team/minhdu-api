import {Injectable} from '@nestjs/common';
import {CreateEggDto} from './dto/create-egg.dto';
import {UpdateEggDto} from './dto/update-egg.dto';
import {SearchEggDto} from "./dto/search-egg.dto";
import {EggRepository} from "./egg.repository";
import * as moment from "moment";
import {EggTypeService} from "../egg-type/egg-type.service";

@Injectable()
export class EggService {
  constructor(
    private readonly repository: EggRepository,
    private readonly eggTypeService: EggTypeService
  ) {
  }

  async create(body: CreateEggDto) {
    return await this.repository.create(body);
  }

  async findAll(search: SearchEggDto) {
    return await this.repository.findAll(search);
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  async update(id: number, updates: UpdateEggDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }
}
