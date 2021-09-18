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
    for (let i = 0; i < 10; i++) {
      const department = await prisma.department.create({
        data: {
          name: faker.company.companySuffix,
          branchId: branch.id,
        }
      });
      for (let i = 0; i < 10; i++) {
        const position = await prisma.position.create({
          data: {
            name: faker.company.bsBuzz,
            departmentId: department.id,
            workday: Math.floor(Math.random() * (30 - 26) + 26),
          }
        });
      }
    }
  }

  for (let i = 0; i < 1000; i++) {
    const ward = await prisma.ward.findUnique({where: {id: Math.floor(Math.random() * (30 - 10) + 10)}});
    const position = await prisma.position.findUnique({where: {id: Math.floor(Math.random() * (30 - 10) + 10)}});
    const employee = await prisma.employee.create({
      data: {
        code: `MD0000${i}`,
        firstName: faker.name.firstName,
        lastName: faker.name.lastName,
        gender: "MALE",
        phone: faker.phone.phoneNumber,
        birthday: faker.dae.soon,
        birthplace: "cc",
        identify: `123456${i}`,
        idCardAt: faker.dae.soon,
        issuedBy: faker.address.streetAddress,
        address: faker.address.streetAddress,
        wardId: ward.id,
        positionId: position.id,
        isFlatSalary: i % 2 === 0,
        ethnicity: "Khong",
        religion: "Deo",
        createdAt: faker.dae.soon,
      }
    });
  }
}

main().catch(err => console.error(err));
