import { Module } from "@nestjs/common";
import { AreaController } from "./area.controller";
import { AreaService } from "./area.service";
import { CampModule } from "../camp/camp.module";

@Module({
  imports: [CampModule],
  controllers: [AreaController],
  providers: [AreaService],
  exports: [AreaService],
})
export class AreaModule {}
