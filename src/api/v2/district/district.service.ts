import {Injectable} from '@nestjs/common';
import {CreateDistrictDto} from './dto/create-district.dto';
import {UpdateDistrictDto} from './dto/update-district.dto';
import {DistrictRepository} from "./district.repository";

@Injectable()
export class DistrictService {
  constructor(private readonly repository: DistrictRepository) {
  }

  create(createDistrictDto: CreateDistrictDto) {
    return this.repository.create(createDistrictDto);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} district`;
  }

  update(id: number, updateDistrictDto: UpdateDistrictDto) {
    return `This action updates a #${id} district`;
  }

  remove(id: number) {
    return `This action removes a #${id} district`;
  }
}
