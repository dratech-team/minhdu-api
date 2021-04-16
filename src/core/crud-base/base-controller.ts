import { Get, Post, Delete, Put, Body, Param, Query } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { IBaseService } from "./ibase.service";
import { CorePaginateResult } from "../interfaces/pagination";
import { PaginatorOptions } from "./interface/pagination.interface";
import { ObjectId } from "mongodb";

export class BaseController<T, DTO = any> {
  constructor(private readonly IBaseService: IBaseService<T>) {}

  @Get()
  @ApiResponse({ status: 200, description: "Ok" })
  async findAll(
    @Query("page") page: number,
    @Query("limit") limit: number,
    ...args: any[]
  ): Promise<CorePaginateResult<T>> {
    let options: PaginatorOptions = {
      page,
      limit,
    };
    if (!page || !limit) {
      options = {};
    }
    return await this.IBaseService.findAll(options);
  }

  @Get(":id")
  @ApiResponse({
    status: 200,
    description: "Entity retrieved successfully.",
  })
  @ApiResponse({ status: 404, description: "Entity does not exist" })
  async findById(@Param("id") id: ObjectId, ...args: any[]): Promise<T> {
    return await this.IBaseService.findOne(id);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: "The record has been successfully created.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @ApiResponse({ status: 400, description: "Bad Request." })
  async create(@Body() body: DTO, ...args: any[]): Promise<T> {
    return await this.IBaseService.create(body);
  }

  @Delete(":id")
  @ApiResponse({
    status: 200,
    description: "Entity deleted successfully.",
  })
  @ApiResponse({ status: 400, description: "Bad Request." })
  @ApiResponse({ status: 404, description: "Entity does not exist" })
  async delete(@Param("id") id: ObjectId, ...args: any[]): Promise<void> {
    return await this.IBaseService.delete(id);
  }

  @Put(":id")
  @ApiResponse({ status: 400, description: "Bad Request." })
  @ApiResponse({
    status: 200,
    description: "Entity deleted successfully.",
  })
  @ApiResponse({ status: 404, description: "Entity does not exist" })
  async update(
    @Body() updates: DTO,
    @Param("id") id: ObjectId,
    ...args: any[]
  ): Promise<T> {
    return await this.IBaseService.update(id, updates);
  }
}
