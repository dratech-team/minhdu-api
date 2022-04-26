import {Module} from '@nestjs/common';
import {PrismaService} from "../../../prisma.service";
import {WarehouseController} from "./warehouse.controller";
import {WarehouseService} from "./warehouse.service";

@Module({
  controllers: [WarehouseController],
  providers: [WarehouseService, PrismaService]
})
export class WarehouseModule {
}
