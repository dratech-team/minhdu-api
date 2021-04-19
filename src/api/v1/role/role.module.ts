import { Module } from "@nestjs/common";

import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";
import { MongooseModule } from "@nestjs/mongoose";
// import { ModelName } from "@/core/constants/database.constant";
import { RoleDocumentSchema } from "./entities/role.schema";
import { ModelName } from "../../../common/constant/database.constant";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelName.ROLE, schema: RoleDocumentSchema },
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
