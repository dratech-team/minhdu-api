import {Module} from '@nestjs/common';
import {DegreeService} from './degree.service';
import {DegreeController} from './degree.controller';
import {PrismaService} from "../../../prisma.service";

@Module({
  controllers: [DegreeController],
  providers: [PrismaService, DegreeService]
})
export class DegreeModule {
}
