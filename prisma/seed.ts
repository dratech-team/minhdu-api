import {PrismaClient, Role} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const acc = await prisma.account.create({
    data: {
      username: "app-sell",
      password: "root",
      role: Role.SALESMAN,
    }
  });

  console.log(acc);
}
