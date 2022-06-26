import {Module} from '@nestjs/common';
import {ProductService} from './product.service';
import {ProductController} from './product.controller';
import {PrismaService} from "../../../prisma.service";
import {ProductRepository} from "./product.repository";

@Module({
  controllers: [ProductController],
  providers: [ProductService, PrismaService, ProductRepository]
})
export class ProductModule {
}
