import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards} from '@nestjs/common';
import {BranchService} from './branch.service';
import {CreateBranchDto} from './dto/create-branch.dto';
import {BranchEntity} from "./entities/branch.entity";
import {ObjectId} from "mongodb";
import {UpdateBranchDto} from "./dto/update-branch.dto";
import {JwtAuthGuard} from "../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../core/guard/api-key-auth.guard";
import {RolesGuard} from 'src/core/guard/role.guard';
import {Roles} from "../../../core/decorators/roles.decorator";
import {UserType} from "../../../core/constants/role-type.constant";
import {PaginateResult} from "mongoose";

@Controller('v1/branch')
@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
export class BranchController {
  constructor(private readonly service: BranchService) {
  }

  @Roles(UserType.ADMIN)
  @Post()
  async create(@Body() body: CreateBranchDto): Promise<BranchEntity> {
    return this.service.create(body);
  }

  @Roles(UserType.ADMIN)
  @Get()
  async findAll(
    @Query("page", ParseIntPipe) page: number,
    @Query("limit", ParseIntPipe) limit: number
  ): Promise<PaginateResult<BranchEntity>> {
    return this.service.findAll({page, limit});
  }

  @Roles(UserType.ADMIN)
  @Get("/areas/:id")
  async findAllArea(
    @Param("id") id: ObjectId,
    @Query("page", ParseIntPipe) page: number,
    @Query("limit", ParseIntPipe) limit: number
  ): Promise<PaginateResult<BranchEntity>> {
    return await this.service.findAllAreas(id, {page, limit});
  }

  @Roles(UserType.ADMIN)
  @Get(':id')
  async findById(@Param("id") id: ObjectId): Promise<BranchEntity> {
    return this.service.findById(id);
  }

  @Roles(UserType.ADMIN)
  @Put(':id')
  async update(
    @Param("id") id: ObjectId,
    @Body() updates: UpdateBranchDto
  ): Promise<BranchEntity> {
    return this.service.update(id, updates);
  }

  @Roles(UserType.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: ObjectId): Promise<void> {
    await this.service.remove(id);
  }

  @Roles(UserType.ADMIN)
  @Delete(':id')
  async removeDepartment(@Param('id') id: ObjectId): Promise<void> {
    return this.service.remove(id);
  }
}
