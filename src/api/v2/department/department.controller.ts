import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {DepartmentService} from './department.service';
import {CreateDepartmentDto} from './dto/create-department.dto';
import {UpdateDepartmentDto} from './dto/update-department.dto';
import {Roles} from "../../../core/decorators/roles.decorator";
import {UserType} from "../../../core/constants/role-type.constant";
import {JwtAuthGuard} from "../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../core/guard/api-key-auth.guard";
import {RolesGuard} from "../../../core/guard/role.guard";

@UseGuards(JwtAuthGuard, ApiKeyGuard)
@Controller('v2/department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {
  }

  @UseGuards(RolesGuard)
  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE)
  @Post()
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  @Get()
  findAll() {
    return this.departmentService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto
  ) {
    return this.departmentService.update(+id, updateDepartmentDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentService.remove(+id);
  }
}
