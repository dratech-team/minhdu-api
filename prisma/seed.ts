import {CalculationType, ConditionType, DatetimeUnit, PrismaClient, RoleEnum} from "@prisma/client";


const prisma = new PrismaClient();

async function main() {
  // nhân sự
  await prisma.role.createMany({
    data: [
      {
        id: 1,
        name: "Supper Admin",
        role: RoleEnum.SUPPER_ADMIN,
      },
      {
        id: 2,
        name: "Admin",
        role: RoleEnum.ADMIN,
      },
      {
        id: 3,
        name: "Nhân sự",
        role: RoleEnum.HUMAN_RESOURCE,
      },
      {
        id: 4,
        name: "Bán hàng",
        role: RoleEnum.SALESMAN,
      },
      {
        id: 5,
        name: "Kho",
        role: RoleEnum.WAREHOUSE,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.salaryRecipe.createMany({
    data: [
      {
        id: 1,
        title: "Công thức 1",
      },
      {
        id: 2,
        title: "Công thức 2",
      },
      {
        id: 3,
        title: "Công thức 3",
      },
      {
        id: 4,
        title: "Công thức 4",
      },
      {
        id: 5,
        title: "Công thức 5",
      }
    ],
    skipDuplicates: true
  });

  await prisma.calculation.createMany({
    data: [
      {
        id: 1,
        condition: ConditionType.NO_CONDITION,
        with: null,
        calculate: CalculationType.ADD,
        unit: DatetimeUnit.MONTH,
      },
      {
        id: 2,
        condition: ConditionType.GREATER_EQUAL,
        with: null,
        calculate: CalculationType.ADD,
        unit: DatetimeUnit.MONTH,
      },
      {
        id: 3,
        condition: ConditionType.GREATER_EQUAL,
        with: null,
        calculate: CalculationType.ADD,
        unit: DatetimeUnit.DAY,
      },
      {
        id: 4,
        condition: ConditionType.LESS,
        with: null,
        calculate: CalculationType.ADD,
        unit: DatetimeUnit.MONTH,
      },
      {
        id: 5,
        condition: ConditionType.LESS_EQUAL,
        with: null,
        calculate: CalculationType.ADD,
        unit: DatetimeUnit.MONTH,
      },
      {
        id: 6,
        condition: ConditionType.NO_CONDITION,
        with: null,
        calculate: CalculationType.SUB,
        unit: DatetimeUnit.MONTH,
      },
    ],
    skipDuplicates: true
  });

  await prisma.salaryBlock.createMany({
    data: [
      {
        title: "Lương cơ bản",
        stt: 1,
        calculationId: 1,
      },
      {
        title: "Phụ cấp lương",
        stt: 2,
        calculationId: 1,
      },
      {
        stt: 3,
        title: "Phụ cấp khác",
        calculationId: 1,
      },
      {
        stt: 4,
        title: "Tăng ca",
        calculationId: 1,
      },
      {
        stt: 3,
        title: "Khấu trừ",
        calculationId: 1,
      },
      {
        stt: 4,
        title: "Ngày lễ",
        calculationId: 1,
      },
      {
        stt: 5,
        title: "Remote",
        calculationId: 1,
      }
    ]
  });
  // bán hàng
  await prisma.commodityTemplate.createMany({
    data: [
      {
        id: 1,
        code: "MD1.BD",
        name: "Gà loại 1",
      },
      {
        id: 2,
        code: "MD2.BD",
        name: "Gà loại 2",
      },
      {
        id: 3,
        code: "MD3.BD",
        name: "Gà loại 3",
      },
      {
        id: 4,
        code: "MD3S.BD",
        name: "MD3S.BD",
      },
      {
        id: 5,
        code: "GM",
        name: "Gà mía",
      },
      {
        id: 6,
        code: "GNBT",
        name: "Gà nồi bến tre",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.supplier.createMany({
    data: {name: "Khác"},
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

main().catch((err) => console.error(err));
