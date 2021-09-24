import {PrismaClient, Role} from "@prisma/client";
import {HttpService} from "@nestjs/axios";
import * as faker from "faker";

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

  for (let i = 0; i < 10; i++) {
    // province
    const province = await prisma.province.create({
      data: {
        name: faker.address.city,
        code: i,
        nationId: nation.id,
        codename: faker.address.zipCode,
        divisionType: "divisionType",
        phoneCode: 123,
      },
    });

    for (let i = 0; i < 10; i++) {
      const district = await prisma.district.create({
        data: {
          name: faker.address.streetName,
          code: i,
          provinceId: province.id,
          codename: faker.address.zipCode,
          divisionType: "divisionType",
        },
      });

      for (let i = 0; i < 10; i++) {
        const ward = await prisma.ward.create({
          data: {
            name: faker.address.streetAddress,
            code: i,
            districtId: district.id,
            codename: faker.address.zipCode,
            divisionType: "divisionType",
          },
        });
      }
    }

  }

  for (let i = 0; i < 10; i++) {
    const branch = await prisma.branch.create({
      data: {
        code: "PN" + i,
        name: faker.company.companyName,
      }
    });
  }
}

main().catch(err => console.error(err));
