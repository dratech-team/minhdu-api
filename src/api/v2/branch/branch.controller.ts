import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query} from '@nestjs/common';
import {BranchService} from './branch.service';
import {CreateBranchDto} from './dto/create-branch.dto';
import {UpdateBranchDto} from './dto/update-branch.dto';

@Controller('v2/branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {
  }

  @Post()
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchService.create(createBranchDto);
  }

  @Get()
  findAll(
    @Query("skip", ParseIntPipe) skip: number,
    @Query("take", ParseIntPipe) take: number,
    @Query("areaId") areaId?: number,
  ) {
    return this.branchService.findAll(+skip, +take, +areaId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.branchService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchService.update(id, updateBranchDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.branchService.remove(id);
  }
}
