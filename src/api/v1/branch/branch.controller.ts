import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {BranchService} from './branch.service';
import {CreateBranchDto} from './dto/create-branch.dto';
import {BaseController} from "../../../core/crud-base/base-controller";
import {BranchEntity} from "./entities/branch.entity";
import {CorePaginateResult} from "../../../core/interfaces/pagination";
import {ObjectId} from "mongodb";
import {UpdateBranchDto} from "./dto/update-branch.dto";
import {JwtAuthGuard} from "../../../core/guard/jwt-auth.guard";
import {ApiKeyGuard} from "../../../core/guard/api-key-auth.guard";


@Controller('v1/branch')
@UseGuards(JwtAuthGuard)
@UseGuards(ApiKeyGuard)
export class BranchController extends BaseController<BranchEntity> {
  constructor(private readonly branchService: BranchService) {
    super(branchService);
  }

  @Post()
  async create(@Body() body: CreateBranchDto, ...args): Promise<BranchEntity> {
    return super.create(body, ...args);
  }

  @Get()
  async findAll(
    @Param("page") page: number,
    @Param("limit") limit: number
  ): Promise<CorePaginateResult<BranchEntity>> {
    return super.findAll(page, limit,);
  }

  @Get(':id')
  async findOne(id: ObjectId, ...args): Promise<BranchEntity> {
    return super.findOne(id, ...args);
  }

  @Put(':id')
  async update(@Body() updates: UpdateBranchDto, @Param("id") id: ObjectId, ...args): Promise<BranchEntity> {
    return super.update(updates, id, ...args);
  }

  @Delete(':id')
  async remove(@Param('id') id: ObjectId): Promise<void> {
    return super.remove(id);
  }
}
