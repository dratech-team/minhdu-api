import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MaterialsWarehouseService } from "./materials-warehouse.service";
import { MaterialsWarehouseController } from "./materials-warehouse.controller";
import { MaterialsWarehouseSchema } from "./schemas/materials-warehouse.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "materials-warehouse", schema: MaterialsWarehouseSchema },
    ]),
  ],
  controllers: [MaterialsWarehouseController],
  providers: [MaterialsWarehouseService],
})
export class MaterialsWarehouseModule {}
