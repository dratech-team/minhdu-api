import {Module} from '@nestjs/common';
import {DegreeService} from './degree.service';
import {DegreeController} from './degree.controller';
import {PrismaService} from "../../../prisma.service";

@Module({
  imports: [],
  controllers: [DegreeController],
  providers: [DegreeService, PrismaService]
})
export class DegreeModule {
}
