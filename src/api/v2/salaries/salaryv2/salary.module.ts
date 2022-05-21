import {Module} from '@nestjs/common';
import {SalaryService} from './salary.service';
import {SalaryController} from './salary.controller';
import {SalaryRepository} from "./salary.repository";
import {PrismaService} from "../../../../prisma.service";
import {ConfigModule} from "../../../../core/config";

@Module({
  imports: [ConfigModule],
  controllers: [SalaryController],
  providers: [
    SalaryService,
    SalaryRepository,
    PrismaService,
  ],
  exports: [SalaryService]
})
export class SalaryModule {
}
