import { Module } from "@nestjs/common";
import { StorageService } from "./storage.service";
import { StorageController } from "./storage.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { StorageSchema } from "../../schemas/storage/storage.schema";
import { VendorsSchema } from "../../schemas/vendors/vendors.schema";
import { MaterialsWarehouseSchema } from "../../schemas/materials-warehouse/materials-warehouse.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "storage", schema: StorageSchema }]),
    MongooseModule.forFeature([{ name: "vendors", schema: VendorsSchema }]),
    MongooseModule.forFeature([
      { name: "materials-warehouse", schema: MaterialsWarehouseSchema }
    ])
  ],
  controllers: [StorageController],
  providers: [StorageService]
})
export class StorageModule {}
