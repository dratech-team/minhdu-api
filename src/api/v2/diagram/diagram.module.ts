import {Module} from '@nestjs/common';
import {DiagramService} from './diagram.service';
import {DiagramController} from './diagram.controller';
import {PrismaService} from "../../../prisma.service";

@Module({
  controllers: [DiagramController],
  providers: [DiagramService, PrismaService]
})
export class DiagramModule {
}
