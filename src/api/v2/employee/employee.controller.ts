import {Body, Controller, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {EmployeeService} from './employee.service';
import {CreateEmployeeDto} from './dto/create-employee.dto';
import {Roles} from "../../../core/decorators/roles.decorator";
import {UserType} from "../../../core/constants/role-type.constant";
import {ReqProfile} from "../../../core/decorators/req-profile.decorator";
import {UpdateEmployeeDto} from "./dto/update-employee.dto";
import {ApiV2Constant} from "../../../common/constant/api.constant";
import {GenderType} from '@prisma/client';
import {ParseDatetimePipe} from "../../../core/pipe/datetime.pipe";
import {CustomParseBooleanPipe} from 'src/core/pipe/custom-boolean.pipe';

@Controller(ApiV2Constant.EMPLOYEE)
// @UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {
  }

  @Post()
  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE)
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE, UserType.CAMP_ACCOUNTING)
  findAll(
    @ReqProfile() branchId?: number,
    @Query("skip") skip?: number,
    @Query("take") take?: number,
    @Query("code") code?: string,
    @Query("name") name?: string,
    @Query("gender") gender?: GenderType,
    @Query("createdAt", ParseDatetimePipe) createdAt?: any,
    @Query("isFlatSalary", CustomParseBooleanPipe) isFlatSalary?: any,
    @Query("branch") branch?: string,
    @Query("department") department?: string,
    @Query("position") position?: string,
  ) {
    return this.employeeService.findAll(branchId, skip, take, {
      code,
      name,
      gender,
      createdAt,
      isFlatSalary,
      branch,
      department,
      position
    })
      ;
  }

  @Get(':id')
  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE, UserType.CAMP_ACCOUNTING)
  findOne(@Param('id') id: number) {
    return this.employeeService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE)
  update(@Param('id') id: number, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }


  // @Delete(':id')
  // @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE)
  // remove(@Param('id') id: string) {
  //   return this.employeeService.remove(id);
  // }
}
