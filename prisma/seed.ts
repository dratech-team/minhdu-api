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

  // const overtimeTemplate = await prisma.overtimeTemplate.createMany({
  //   data: [
  //     {

  //     }
  //   ]
  // })
}

main().catch(err => console.error(err));
