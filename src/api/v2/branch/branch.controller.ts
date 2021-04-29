import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query} from '@nestjs/common';
import {BranchService} from './branch.service';
import {CreateBranchDto} from './dto/create-branch.dto';
import {UpdateBranchDto} from './dto/update-branch.dto';
import {skip} from "rxjs/operators";

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
  findOne(@Param('id') id: number) {
    return this.branchService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchService.update(+id, updateBranchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.branchService.remove(+id);
  }
}
