import {Module} from "@nestjs/common";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {AreaModule} from "../area/area.module";
import {PayrollModule} from "../payroll/payroll.module";
import {MongooseModule} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {UserSchema} from "./entities/user.entity";
import {PositionModule} from "../position/position.module";
import {BranchModule} from "../branch/branch.module";

@Module({
  imports: [
    MongooseModule.forFeature([{name: ModelName.USER, schema: UserSchema}]),
    AreaModule,
    PayrollModule,
    PositionModule,
    BranchModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {
}

