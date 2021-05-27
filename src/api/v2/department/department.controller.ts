import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {DepartmentService} from './department.service';
import {CreateDepartmentDto} from './dto/create-department.dto';
import {UpdateDepartmentDto} from './dto/update-department.dto';
import {Roles} from "../../../core/decorators/roles.decorator";
import {UserType} from "../../../core/constants/role-type.constant";

// @UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller('v2/department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {
  }

  @Roles(UserType.ADMIN)
  @Post()
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  // @Get("/branch/:id")
  // findAllBranch(
  //   @Query("skip") skip: number,
  //   @Query("take") take: number,
  //   @Param("id") id: number,
  //   @Query("name") name: string,
  // ) {
  //   return this.departmentService.findAll(+skip, +take, +id, name);
  // }

  @Get()
  findAll() {
    return this.departmentService.findAll();
  }


  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.departmentService.findOne(+id);
  // }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto
  ) {
    return this.departmentService.update(+id, updateDepartmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentService.remove(+id);
  }
}
