import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {RoleService} from './role.service';
import {CreateRoleDto} from './dto/create-role.dto';
import {UpdateRoleDto} from './dto/update-role.dto';
import {ReqProfile} from "../../../core/decorators/req-profile.decorator";
import {ProfileEntity} from "../../../common/entities/profile.entity";

@Controller('v2/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {
  }

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  findAll(@ReqProfile() profile: ProfileEntity) {
    return this.roleService.findAll(profile);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}
