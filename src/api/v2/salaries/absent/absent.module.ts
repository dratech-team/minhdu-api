import {Module} from '@nestjs/common';
import {AbsentService} from './absent.service';
import {AbsentController} from './absent.controller';
import {PrismaService} from "../../../../prisma.service";
import {AbsentRepository} from "./absent.repository";
import {ConfigModule} from "../../../../core/config/config.module";

@Module({
  imports: [ConfigModule],
  controllers: [AbsentController],
  providers: [AbsentService, PrismaService, AbsentRepository]
})
export class AbsentModule {
}
