import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AreaModule } from "../area/area.module";
import { SalaryModule } from "../salary/salary.module";

@Module({
  imports: [AreaModule, SalaryModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
