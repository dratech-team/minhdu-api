import {PrismaClient, Role} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.account.create({
    data: {
      username: "app-sell",
      password: "root",
      role: Role.SALESMAN,
    }
  });

  await prisma.nation.create({
    data: {
      name: "Việt Nam",
      code: "VN",
    }
  });

}
