import { Module } from "@nestjs/common";
import { AreasService } from "./areas.service";
import { AreasController } from "./areas.controller";

@Module({
  imports: [],
  controllers: [AreasController],
  providers: [AreasService]
})
export class AreasModule {}
