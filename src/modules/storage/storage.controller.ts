import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  Request,
  Response
} from "@nestjs/common";
import { StorageService } from "./storage.service";
import { CreateStorageDto } from "./dto/create-storage.dto";
import { UpdateStorageDto } from "./dto/update-storage.dto";
import { QueryStorageDto } from "./dto/query-storage.dto";
import { ApiTags, ApiResponse } from "@nestjs/swagger";

@ApiTags("Storage")
@Controller("storage")
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  async create(@Body() createStorageDto: CreateStorageDto) {
    return this.storageService.create(createStorageDto);
  }

  @Get()
  async findAll(
    @Query() query: QueryStorageDto,
    @Request() req,
    @Response() res
  ) {
    const { items, total } = await this.storageService.findAll(query);
    return res.status(200).sendItems(items, total);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.storageService.findOne(id);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateStorageDto: UpdateStorageDto
  ) {
    return this.storageService.update(id, updateStorageDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.storageService.remove(id);
  }
}
