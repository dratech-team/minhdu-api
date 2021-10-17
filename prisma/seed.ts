import {PrismaClient, Role, RoleEnum} from "@prisma/client";
import {HttpService} from "@nestjs/axios";
import * as faker from "faker";

const prisma = new PrismaClient();
const http = new HttpService();

async function main() {


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
