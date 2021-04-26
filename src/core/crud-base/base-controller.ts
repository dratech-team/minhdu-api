import {Body, Delete, Get, Param, Post, Put, Query} from "@nestjs/common";
import {ApiResponse} from "@nestjs/swagger";
import {IBaseService} from "./ibase.service";
import {ObjectId} from "mongodb";
import {PaginatorOptions} from "./interface/pagination.interface";
import {PaginateResult} from "mongoose";

export class BaseController<T, DTO = any> {
  constructor(private readonly IBaseService: IBaseService<T>) {
  }

  @Get()
  @ApiResponse({status: 200, description: "Ok"})
  async findAll(
    @Query("page") page: number,
    @Query("limit") limit: number,
    ...args: any[]
  ): Promise<PaginateResult<T>> {
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
  @ApiResponse({status: 404, description: "Entity does not exist"})
  async findOne(@Param("id") id: ObjectId, ...args: any[]): Promise<T> {
    return await this.IBaseService.findById(id);
  }

  @Get(":id")
  @ApiResponse({
    status: 200,
    description: "Entity retrieved successfully.",
  })
  @ApiResponse({status: 404, description: "Entity does not exist"})
  async findById(@Param("id") id: ObjectId, ...args: any[]): Promise<T> {
    return await this.IBaseService.findById(id);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: "The record has been successfully created.",
  })
  @ApiResponse({status: 403, description: "Forbidden."})
  @ApiResponse({status: 400, description: "Bad Request."})
  async create(@Body() body: DTO, ...args: any[]): Promise<T> {
    return await this.IBaseService.create(body);
  }

  @Delete(":id")
  @ApiResponse({
    status: 200,
    description: "Entity deleted successfully.",
  })
  @ApiResponse({status: 400, description: "Bad Request."})
  @ApiResponse({status: 404, description: "Entity does not exist"})
  async remove(@Param("id") id: ObjectId, ...args: any[]): Promise<void> {
    return await this.IBaseService.remove(id);
  }

  @Put(":id")
  @ApiResponse({status: 400, description: "Bad Request."})
  @ApiResponse({
    status: 200,
    description: "Entity deleted successfully.",
  })
  @ApiResponse({status: 404, description: "Entity does not exist"})
  async update(
    @Body() updates: DTO,
    @Param("id") id: ObjectId,
    ...args: any[]
  ): Promise<T> {
    return await this.IBaseService.update(id, updates);
  }

  @ApiResponse({status: 404, description: "Entity does not exist"})
  async count(...args: any[]): Promise<T> {
    return await this.IBaseService.count();
  }
}
