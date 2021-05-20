import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {EmployeeService} from './employee.service';
import {CreateEmployeeDto} from './dto/create-employee.dto';
import {UpdateEmployeeDto} from './dto/update-employee.dto';
import {CreateSalaryDto} from "../salary/dto/create-salary.dto";
import {UpdateSalaryDto} from "./dto/update-salary.dto";
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
  @Roles(UserType.ADMIN)
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Post(":id")
  createSalary(@Param("id") id: string, @Body() body: CreateSalaryDto) {
    return this.employeeService.createSalary(id, body);
  }

  @Get()
  @Roles(UserType.ADMIN)
  findAll(
    @Query("skip") skip: number,
    @Query("take") take: number,
    @Query("search") search: string,
  ) {
    return this.employeeService.findAll(+skip, +take, search);
  }

  @Get(':id')
  @Roles(UserType.ADMIN)
  findOne(@Param('id') id: string) {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Patch('/salary/:id')
  updateSalary(@Param('id') id: number, @Body() updates: UpdateSalaryDto) {
    return this.employeeService.updateSalary(+id, updates);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeeService.remove(id);
  }
}
