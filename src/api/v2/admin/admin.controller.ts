import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {AdminService} from './admin.service';
import {CreateAdminDto} from './dto/create-admin.dto';
import {UpdateAdminDto} from './dto/update-admin.dto';
import {SearchAdminDto} from "./dto/search-admin.dto";

@Controller('v2/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {
  }

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get('hr')
  findAll(
    @Query("take") take: number,
    @Query("skip") skip: number,
    @Query() search: SearchAdminDto,
  ) {
    return this.adminService.findAll(+take, +skip, search);
  }

  @Get('sell')
  findAllSell(
    @Query("take") take: number,
    @Query("skip") skip: number,
  ) {
    // return this.adminService.findAll(+take, +skip);
  }

  @Get('hr/:id')
  findOne(@Param('id') id: string, @Query() search: SearchAdminDto) {
    return this.adminService.findOne(+id, search);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
