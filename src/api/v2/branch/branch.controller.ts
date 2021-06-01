import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from '@nestjs/common';
import {BranchService} from './branch.service';
import {CreateBranchDto} from './dto/create-branch.dto';
import {UpdateBranchDto} from './dto/update-branch.dto';
import {JwtAuthGuard} from "../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../core/guard/api-key-auth.guard";
import {RolesGuard} from "../../../core/guard/role.guard";
import {Roles} from "../../../core/decorators/roles.decorator";
import {UserType} from "../../../core/constants/role-type.constant";

@UseGuards(JwtAuthGuard, ApiKeyGuard)
@Controller('v2/branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {
  }

  @UseGuards(RolesGuard)
  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE)
  @Post()
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchService.create(createBranchDto);
  }

  @Get()
  findAll() {
    return this.branchService.findAll();
  }


  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.branchService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchService.update(id, updateBranchDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserType.ADMIN, UserType.HUMAN_RESOURCE)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.branchService.remove(+id);
  }
}
