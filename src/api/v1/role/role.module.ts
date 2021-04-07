import { Module } from "@nestjs/common";

import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ModelName } from "@/constants/database.constant";
import { RoleDocumentSchema } from "./schemas/role.schema";

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
