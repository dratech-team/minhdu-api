import {Module} from '@nestjs/common';
import {LoggerService} from './logger.service';
import {LoggerController} from './logger.controller';
import {PrismaService} from "../../../../prisma.service";
import {ConfigModule} from "../../../../core/config/config.module";

@Module({
  imports: [ConfigModule],
  controllers: [LoggerController],
  providers: [PrismaService, LoggerService]
})
export class LoggerModule {
}
