import {Module} from '@nestjs/common';
import {RelativeService} from './relative.service';
import {RelativeController} from './relative.controller';
import {PrismaService} from "../../../prisma.service";

@Module({
  imports: [],
  controllers: [RelativeController],
  providers: [RelativeService, PrismaService]
})
export class RelativeModule {
}
