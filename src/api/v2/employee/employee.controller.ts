import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {EmployeeService} from './employee.service';
import {CreateEmployeeDto} from './dto/create-employee.dto';
import {UpdateEmployeeDto} from './dto/update-employee.dto';
import {JwtAuthGuard} from "../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../core/guard/api-key-auth.guard";
import {RolesGuard} from "../../../core/guard/role.guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {UserType} from "../../../core/constants/role-type.constant";

@Controller('v2/employee')
@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {
  }

  @Post()
  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE)
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE)
  findAll(
    @Query("skip", ParseIntPipe) skip: number,
    @Query("take", ParseIntPipe) take: number,
    @Query("search") search: string,
  ) {
    return this.employeeService.findAll(+skip, +take, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE)
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE)
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}
