import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AreaModule } from "../area/area.module";
import { SalaryModule } from "../salary/salary.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ModelName } from "../../../common/constant/database.constant";
import { UserSchema } from "./schema/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelName.USER, schema: UserSchema }]),
    AreaModule,
    SalaryModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
