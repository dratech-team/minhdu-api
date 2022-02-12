import {PrismaClient, RoleEnum} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      {
        name: "Nhân sự",
        role: RoleEnum.HUMAN_RESOURCE,
      },
      {
        name: "Bán hàng",
        role: RoleEnum.SALESMAN,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.commodityTemplate.createMany({
    data: [
      {
        code: "MD1.BD",
        name: "Gà loại 1"
      },
      {
        code: "MD2.BD",
        name: "Gà loại 2"
      },
      {
        code: "MD3.BD",
        name: "Gà loại 3"
      },
      {
        code: "MD3S.BD",
        name: "MD3S.BD"
      },
      {
        code: "GM",
        name: "Gà mía"
      },
      {
        code: "GNBT",
        name: "Gà nồi bến tre"
      },
    ],
    skipDuplicates: true,
  });
  // await prisma.position.createMany({
  //   data: [
  //     {
  //       name: "Position 1",
  //       workday: 26,
  //     },
  //     {
  //       name: "Position 2",
  //       workday: 26,
  //     },
  //     {
  //       name: "Position 3",
  //       workday: 26,
  //     }
  //   ]
  // });
  //
  // await prisma.branch.createMany({
  //   data: [
  //     {
  //       name: "Branch 1",
  //     },
  //     {
  //       name: "Branch 2",
  //     },
  //     {
  //       name: "Branch 3",
  //     }
  //   ],
  //   skipDuplicates: true
  // });
  // for (let i = 0; i < 1000; i++) {
  //   await prisma.employee.create({
  //     data: {
  //       lastName: faker.name.lastName(),
  //       gender: "MALE",
  //       phone: faker.phone.phoneNumber(),
  //       birthday: faker.date.between('2000-01-01', '1980-01-05'),
  //       birthplace: faker.address.streetName(),
  //       identify: "12345678" + i,
  //       idCardAt: faker.date.between('2000-01-01', '1980-01-05'),
  //       issuedBy: faker.address.cityName(),
  //       createdAt: faker.date.between('2021-01-01', '2000-01-05'),
  //       workday: 26,
  //       ward: {connect: {id: 12}},
  //       address: faker.address.streetName(),
  //       position: {connect: {id: 1}},
  //       branch: {connect: {id: 2}},
  //       recipeType: RecipeType.CT2,
  //       type: EmployeeType.FULL_TIME,
  //     },
  //     include: {
  //       position: true,
  //       branch: true,
  //     },
  //   });
  // }
}

main().catch(err => console.error(err));
