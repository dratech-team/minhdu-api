import {HttpService} from '@nestjs/axios';
import {Injectable} from '@nestjs/common';
import {CreateProvinceDto} from './dto/create-province.dto';
import {UpdateProvinceDto} from './dto/update-province.dto';
import {ProvinceRepository} from "./province.repository";
import {map} from "rxjs/operators";

@Injectable()
export class ProvinceService {
  constructor(private readonly repository: ProvinceRepository, private readonly http: HttpService) {
  }

  create(createProvinceDto: CreateProvinceDto) {
    return this.repository.create(createProvinceDto);
  }

  async findAll() {
    const url = "https://provinces.open-api.vn/api/?depth=3";
    return await this.http.get(url).pipe(
      map(e => {
        return e.data.map(province => {
          const provinces = Object.assign(province, {id: province.code});
          const districts = province.districts.map(district => {
            const districts = Object.assign(district, {id: district.code});
            const wards = district.wards.map(ward => {
              return Object.assign(ward, {id: ward.code});
            });
            return Object.assign(districts, {wards});
          });
          return Object.assign(provinces, {districts});
        });
      })
    ).toPromise();
  }

  async findOne(id: number) {
    const url = `https://provinces.open-api.vn/api/p/${id}?depth=3`;
    return await this.http.get(url).pipe(
      map(e => {
        const province = Object.assign(e.data, {id: e.data.code});
        const districts = e.data.districts.map(district => {
          const districts = Object.assign(district, {id: district.code});
          const wards = district.wards.map(ward => {
            return Object.assign(ward, {id: ward.code});
          });
          return Object.assign(districts, {wards});
        });
        return Object.assign(province, {districts});
      })
    ).toPromise();
  }

  update(id: number, updateProvinceDto: UpdateProvinceDto) {
    return `This action updates a #${id} province`;
  }

  remove(id: number) {
    return `This action removes a #${id} province`;
  }
}
