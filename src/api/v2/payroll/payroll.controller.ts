import {Body, Controller, Delete, Get, Param, Patch, UseGuards} from '@nestjs/common';
import {PayrollService} from './payroll.service';
import {UpdatePayrollDto} from './dto/update-payroll.dto';
import {JwtAuthGuard} from "../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../core/guard/api-key-auth.guard";
import {RolesGuard} from "../../../core/guard/role.guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {UserType} from "../../../core/constants/role-type.constant";
import {ReqProfile, ReqUserProfile} from "../../../core/decorators/req-profile.decorator";

@Controller('v2/payroll')
@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {
  }

  @Get()
  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE, UserType.CAMP_ACCOUNTING)
  findAll() {
    return this.payrollService.findAll();
  }

  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE, UserType.CAMP_ACCOUNTING)
  @Get(':id')
  findOne(@ReqUserProfile() user: any, @Param('id') id: string) {
    console.log(user);
    return this.payrollService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserType.CAMP_ACCOUNTING)
  update(
    @Param('id') id: number,
    @Body() updatePayrollDto: UpdatePayrollDto
  ) {
    return this.payrollService.update(+id, updatePayrollDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payrollService.remove(+id);
  }
}
