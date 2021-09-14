import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { PrismaService } from "../../../prisma.service";
import { WardController } from "./ward.controller";
import { WardRepository } from "./ward.repository";
import { WardService } from "./ward.service";

@Module({
  imports: [HttpModule],
  controllers: [WardController],
  providers: [PrismaService, WardService, WardRepository],
})
export class WardModule {}
