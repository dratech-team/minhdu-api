import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {EmployeeService} from './employee.service';
import {CreateEmployeeDto} from './dto/create-employee.dto';
import {UpdateEmployeeDto} from './dto/update-employee.dto';
import {CreateSalaryDto} from "../salary/dto/create-salary.dto";
import {UpdateSalaryDto} from "./dto/update-salary.dto";

@Controller('v2/employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {
  }

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Post(":id")
  createSalary(@Param("id") id: string, @Body() body: CreateSalaryDto) {
    return this.employeeService.createSalary(id, body);
  }

  @Get()
  findAll(
    @Query("skip") skip: number,
    @Query("take") take: number
  ) {
    return this.employeeService.findAll(+skip, +take);
  }

  @Get(':id')
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
