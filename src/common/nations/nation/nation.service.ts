import {Injectable} from '@nestjs/common';
import {CreateNationDto} from './dto/create-nation.dto';
import {UpdateNationDto} from './dto/update-nation.dto';
import {NationRepository} from "./nation.repository";

@Injectable()
export class NationService {
  constructor(private readonly repository: NationRepository) {
  }

  create(createNationDto: CreateNationDto) {
    return this.repository.create(createNationDto);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findOne(id);
  }

  update(id: number, updateNationDto: UpdateNationDto) {
    return `This action updates a #${id} nation`;
  }

  remove(id: number) {
    return `This action removes a #${id} nation`;
  }
}
