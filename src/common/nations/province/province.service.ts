import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { CreateProvinceDto } from "./dto/create-province.dto";
import { UpdateProvinceDto } from "./dto/update-province.dto";
import { ProvinceRepository } from "./province.repository";
import { map } from "rxjs/operators";

@Injectable()
export class ProvinceService {
  constructor(
    private readonly repository: ProvinceRepository,
    private readonly http: HttpService
  ) {}

  async create(createProvinceDto: CreateProvinceDto) {
    return await this.repository.create(createProvinceDto);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findOne(id: number) {
    return await this.repository.findOne(id);
  }

  update(id: number, updateProvinceDto: UpdateProvinceDto) {
    return `This action updates a #${id} province`;
  }

  remove(id: number) {
    return `This action removes a #${id} province`;
  }
}
