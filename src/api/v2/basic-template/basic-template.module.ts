import { Module } from "@nestjs/common";
import { BasicTemplateService } from "./basic-template.service";
import { BasicTemplateController } from "./basic-template.controller";
import { PrismaService } from "src/prisma.service";

@Module({
  controllers: [BasicTemplateController],
  providers: [BasicTemplateService, PrismaService],
})
export class BasicTemplateModule {}
