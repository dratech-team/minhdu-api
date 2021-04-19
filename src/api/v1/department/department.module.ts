import { Module } from "@nestjs/common";
import { DepartmentController } from "./department.controller";
import { DepartmentService } from "./department.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ModelName } from "../../../common/constant/database.constant";
import { DepartmentEntity } from "./entities/department.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelName.DEPARTMENT, schema: DepartmentEntity },
    ]),
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentModule {}
