import { Module } from "@nestjs/common";
import { VendorsService } from "./vendors.service";
import { VendorsController } from "./vendors.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { VendorsSchema } from "./schemas/vendors.schema";
@Module({
  imports: [
    MongooseModule.forFeature([{ name: "vendors", schema: VendorsSchema }])
  ],
  controllers: [VendorsController],
  providers: [VendorsService]
})
export class VendorsModule {}
