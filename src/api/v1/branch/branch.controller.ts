import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {BranchService} from './branch.service';
import {CreateBranchDto} from './dto/create-branch.dto';
import {BaseController} from "../../../core/crud-base/base-controller";
import {BranchEntity} from "./entities/branch.entity";
import {CorePaginateResult} from "../../../core/interfaces/pagination";
import {ObjectId} from "mongodb";
import {UpdateBranchDto} from "./dto/update-branch.dto";
import {JwtAuthGuard} from "../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../core/guard/api-key-auth.guard";
import {RolesGuard} from 'src/core/guard/role.guard';
import {Roles} from "../../../core/decorators/roles.decorator";
import {UserType} from "../../../core/constants/role-type.constant";

@Controller('v1/branch')
@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
export class BranchController extends BaseController<BranchEntity> {
  constructor(private readonly branchService: BranchService) {
    super(branchService);
  }

  @Roles(UserType.ADMIN)
  @Post()
  async create(@Body() body: CreateBranchDto, ...args): Promise<BranchEntity> {
    return super.create(body, ...args);
  }

  @Roles(UserType.ADMIN)
  @Get()
  async findAll(
    @Query("page") page: number,
    @Query("limit") limit: number
  ): Promise<CorePaginateResult<BranchEntity>> {
    return super.findAll(page, limit,);
  }

  @Roles(UserType.ADMIN)
  @Get(':id')
  async findOne(id: ObjectId, ...args): Promise<BranchEntity> {
    return super.findOne(id, ...args);
  }

  @Roles(UserType.ADMIN)
  @Put(':id')
  async update(@Body() updates: UpdateBranchDto, @Param("id") id: ObjectId, ...args): Promise<BranchEntity> {
    return super.update(updates, id, ...args);
  }

  @Roles(UserType.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: ObjectId): Promise<void> {
    return super.remove(id);
  }

  @Roles(UserType.ADMIN)
  @Delete(':id')
  async removeDepartment(@Param('id') id: ObjectId): Promise<void> {
    return super.remove(id);
  }
}
