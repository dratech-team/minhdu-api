import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();
prisma.$use(async (params, next) => {
  console.log(params);
  console.log(next);
  return next(params);
});
