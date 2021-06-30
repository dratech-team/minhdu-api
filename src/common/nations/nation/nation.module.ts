import { Module } from '@nestjs/common';
import { NationService } from './nation.service';
import { NationController } from './nation.controller';
import {PrismaService} from "../../../prisma.service";
import {NationRepository} from "./nation.repository";

@Module({
  controllers: [NationController],
  providers: [PrismaService, NationService, NationRepository]
})
export class NationModule {}
