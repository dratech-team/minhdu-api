import {Module} from '@nestjs/common';
import {Salaryv2Service} from './salaryv2.service';
import {Salaryv2Controller} from './salaryv2.controller';
import {Salaryv2Repository} from "./salaryv2.repository";
import {PrismaService} from "../../../../prisma.service";
import {ConfigModule} from "../../../../core/config/config.module";

@Module({
  imports: [ConfigModule],
  controllers: [Salaryv2Controller],
  providers: [
    Salaryv2Service,
    Salaryv2Repository,
    PrismaService,
  ]
})
export class Salaryv2Module {
}
