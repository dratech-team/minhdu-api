import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateWardDto} from './dto/create-ward.dto';
import {UpdateWardDto} from './dto/update-ward.dto';
import {WardRepository} from "./ward.repository";
import {map} from "rxjs/operators";
import {HttpService} from "@nestjs/axios";

@Injectable()
export class WardService {
  constructor(private readonly repository: WardRepository, private readonly http: HttpService) {
  }

  create(createWardDto: CreateWardDto) {

    return this.repository.create(createWardDto);
  }

  findAll(districtId: number) {
    if (!districtId) {
      throw new BadRequestException("Vui lòng truyền vào districtId. Example: {{url}}/v2/ward?districtId={id}");
    }
    return this.repository.findAll(districtId);
  }

  async findOne(id: number) {
    const url = `https://provinces.open-api.vn/api/w/${id}`;
    return await this.http.get(url).pipe(
      map(ward => {
        return Object.assign(ward.data, {id: ward.data.code});
      })
    ).toPromise();
  }

  update(id: number, updateWardDto: UpdateWardDto) {
    return `This action updates a #${id} ward`;
  }

  remove(id: number) {
    return `This action removes a #${id} ward`;
  }
}
