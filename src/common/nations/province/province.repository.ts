import {HttpService} from "@nestjs/axios";
import {BadRequestException, Injectable} from "@nestjs/common";
import {Province} from "@prisma/client";
import {PrismaService} from "../../../prisma.service";
import {CreateProvinceDto} from "./dto/create-province.dto";
import {map} from "rxjs/operators";

@Injectable()
export class ProvinceRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly http: HttpService
  ) {
  }

  async create(body: CreateProvinceDto) {
    try {
      const url = "https://provinces.open-api.vn/api/?depth=3";
      const provinces = await this.http
        .get(url)
        .pipe(map((e) => e.data))
        .toPromise();

      for (let i = 0; i < provinces.length; i++) {
        const province = await this.prisma.province.create({
          data: {
            code: provinces[i].code,
            name: provinces[i].name,
            codename: provinces[i].codename,
            divisionType: provinces[i].division_type,
            nationId: 1,
            phoneCode: provinces[i].phone_code,
          },
        });
        console.log("created province", province.id);
        const districtUrl = `https://provinces.open-api.vn/api/p/${province.code}/?depth=2`;

        const district = await this.http
          .get(districtUrl)
          .pipe(map((e) => e.data))
          .toPromise();

        console.log("created province", province.codename);

        for (let i = 0; i < district.districts.length; i++) {
          const createdDistrict = await this.prisma.district.create({
            data: {
              code: district.districts[i].code,
              codename: district.districts[i].codename,
              divisionType: district.districts[i].division_type,
              name: district.districts[i].name,
              provinceId: province.id,
            }
          });
          console.log("created district", createdDistrict.codename);

          const wardUrl = `https://provinces.open-api.vn/api/d/${createdDistrict.code}/?depth=2`;

          const ward = await this.http
            .get(wardUrl)
            .pipe(map((e) => e.data))
            .toPromise();
          console.log("createdDistrict.id", createdDistrict.id);
          for (let i = 0; i < ward.wards.length; i++) {
            const createdWard = await this.prisma.ward.create({
              data: {
                code: ward.wards[i].code,
                codename: ward.wards[i].codename,
                divisionType: ward.wards[i].division_type,
                name: ward.wards[i].name,
                districtId: createdDistrict.id,
              }
            });

            console.log("created ward", createdWard.codename);
          }
        }
      }
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number): Promise<Province> {
    return await this.prisma.province.findUnique({where: {id}});
  }

  async findAll(): Promise<Province[]> {
    return await this.prisma.province.findMany({
      include: {
        districts: {
          include: {
            wards: true,
          }
        }
      },
    });
  }
}
