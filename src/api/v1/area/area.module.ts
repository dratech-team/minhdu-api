import {Module} from "@nestjs/common";
import {AreaController} from "./area.controller";
import {AreaService} from "./area.service";
import {MongooseModule} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {AreaSchema} from "./entities/area.entity";

@Module({
  imports: [
    MongooseModule.forFeature([{name: ModelName.AREA, schema: AreaSchema}])
  ],
  controllers: [AreaController],
  providers: [AreaService],
  exports: [AreaService],
})
export class AreaModule {
}
