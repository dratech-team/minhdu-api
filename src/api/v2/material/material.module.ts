import {Module} from '@nestjs/common';
import {MaterialService} from './material.service';
import {MaterialController} from './material.controller';
import {MaterialRepository} from "./material.repository";
import {PrismaService} from "../../../prisma.service";

@Module({
  controllers: [MaterialController],
  providers: [MaterialService, MaterialRepository, PrismaService]
})
export class MaterialModule {
}
