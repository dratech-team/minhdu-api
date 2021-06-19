import {Injectable} from '@nestjs/common';
import {CreateRelativeDto} from './dto/create-relative.dto';
import {UpdateRelativeDto} from './dto/update-relative.dto';
import {RelativeRepository} from "./relative.repository";

@Injectable()
export class RelativeService {
  constructor(private readonly service: RelativeRepository) {
  }

  create(body: CreateRelativeDto) {
    return this.service.create(body);
  }

  findAll(branchId: number, skip: number, take: number, search?: string) {
    return this.service.findAll(branchId, skip, take, search);
  }

  findOne(id: number) {
    return this.service.findOne(id);
  }

  update(id: number, updateFamilyDto: UpdateRelativeDto) {
    return this.service.update(id, updateFamilyDto);
  }

  remove(id: number) {
    return this.service.remove(id);
  }
}
