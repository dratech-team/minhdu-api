import {Injectable} from "@nestjs/common";
import {CreateDistrictDto} from "./dto/create-district.dto";
import {UpdateDistrictDto} from "./dto/update-district.dto";
import {DistrictRepository} from "./district.repository";

@Injectable()
export class DistrictService {
  constructor(
    private readonly repository: DistrictRepository,
  ) {
  }

  async create(createDistrictDto: CreateDistrictDto) {
    return await this.repository.create(createDistrictDto);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  update(id: number, updateDistrictDto: UpdateDistrictDto) {
    return `This action updates a #${id} district`;
  }

  remove(id: number) {
    return `This action removes a #${id} district`;
  }
}
