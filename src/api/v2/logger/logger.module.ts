import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerController } from './logger.controller';
import {PrismaService} from "../../../prisma.service";

@Module({
  controllers: [LoggerController],
  providers: [PrismaService, LoggerService]
})
export class LoggerModule {}
