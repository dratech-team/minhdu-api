import {Injectable} from '@nestjs/common';
import {CreateDistrictDto} from './dto/create-district.dto';
import {UpdateDistrictDto} from './dto/update-district.dto';
import {DistrictRepository} from "./district.repository";
import {HttpService} from "@nestjs/axios";
import {map} from "rxjs/operators";

@Injectable()
export class DistrictService {
  constructor(private readonly repository: DistrictRepository, private readonly http: HttpService) {
  }

  create(createDistrictDto: CreateDistrictDto) {
    return this.repository.create(createDistrictDto);
  }

  async findAll() {
    // const districts = await this.http.get("");
  }

  async findOne(id: number) {
    const url = `https://provinces.open-api.vn/api/d/${id}?depth=2`;
    return await this.http.get(url).pipe(
      map(e => {
          const district = Object.assign(e.data, {id: e.data.code});
          const wards = district.wards.map(ward => {
            return Object.assign(ward, {id: ward.code});
          });
          return Object.assign(district, {wards});
      })
    ).toPromise();
  }

  update(id: number, updateDistrictDto: UpdateDistrictDto) {
    return `This action updates a #${id} district`;
  }

  remove(id: number) {
    return `This action removes a #${id} district`;
  }
}
