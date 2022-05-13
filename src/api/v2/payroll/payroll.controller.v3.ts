import {Controller, Get, Param, UseGuards} from "@nestjs/common";
import {ApiV3Constant} from "../../../common/constant/api.constant";
import {ApiKeyGuard, JwtAuthGuard, RolesGuard} from "../../../core/guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {PayrollServicev2} from "./payroll.service.v2";

@Controller(ApiV3Constant.PAYROLL)
@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
export class Payrollv3Controller {
  constructor(
    private readonly payrollServicev2: PayrollServicev2,
  ) {
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.payrollServicev2.findOne(+id);
  }
}
