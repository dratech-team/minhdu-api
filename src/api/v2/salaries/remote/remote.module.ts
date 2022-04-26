import {Module} from '@nestjs/common';
import {RemoteService} from './remote.service';
import {RemoteController} from './remote.controller';
import {RemoteRepository} from "./remote.repository";
import {PrismaService} from "../../../../prisma.service";
import {ConfigModule} from "../../../../core/config/config.module";

@Module({
  imports: [ConfigModule],
  controllers: [RemoteController],
  providers: [RemoteService, RemoteRepository, PrismaService]
})
export class RemoteModule {
}
