import {Module} from '@nestjs/common';
import {DegreeService} from './degree.service';
import {DegreeController} from './degree.controller';
import {DegreeRepository} from "./degree.repository";
import {PrismaService} from "../../../prisma.service";

@Module({
  controllers: [DegreeController],
  providers: [PrismaService, DegreeService, DegreeRepository]
})
export class DegreeModule {
}
