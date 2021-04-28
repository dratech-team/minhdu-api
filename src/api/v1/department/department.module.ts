import {Module} from "@nestjs/common";
import {DepartmentController} from "./department.controller";
import {DepartmentService} from "./department.service";
import {MongooseModule} from "@nestjs/mongoose";
import {ModelName} from "../../../common/constant/database.constant";
import {DepartmentSchema} from "./entities/department.entity";
import {BranchModule} from "../branch/branch.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: ModelName.DEPARTMENT, schema: DepartmentSchema},
    ]),
    BranchModule,
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentModule {
}
