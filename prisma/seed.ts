import {PrismaClient, Role} from "@prisma/client";
import {map} from "rxjs/operators";
import {HttpService} from "@nestjs/axios";

const prisma = new PrismaClient();
const http = new HttpService();

async function main() {
  const acc = await prisma.account.createMany({
    data: [
      {
        username: "app-sell",
        password: "root",
        role: Role.SALESMAN,
      },
      {
        username: "app-hr",
        password: "root",
        role: Role.HUMAN_RESOURCE,
      },
    ],
  });

  // nation
  const nation = await prisma.nation.create({
    data: {
      name: "Việt Nam",
      code: "VN",
    },
  });

  const url = "https://provinces.open-api.vn/api/?depth=3";
  const provinces = await http
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

    const district = await http
      .get(districtUrl)
      .pipe(map((e) => e.data))
      .toPromise();

    console.log("created province", province.codename);

    for (let i = 0; i < district.districts.length; i++) {
      const createdDistrict = await prisma.district.create({
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

      const ward = await http
        .get(wardUrl)
        .pipe(map((e) => e.data))
        .toPromise();
      console.log("createdDistrict.id", createdDistrict.id);
      for (let i = 0; i < ward.wards.length; i++) {
        const createdWard = await prisma.ward.create({
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
}
