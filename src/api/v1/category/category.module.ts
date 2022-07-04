import {Module} from '@nestjs/common';
import {CategoryService} from './category.service';
import {CategoryController} from './category.controller';
import {ConfigModule} from "../../../core/config";
import {PrismaService} from "../../../prisma.service";

@Module({
  imports: [ConfigModule],
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService]
})
export class CategoryModule {
}
