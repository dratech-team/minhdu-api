import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from "@nestjs/common";
import {BasicTemplateService} from "./basic-template.service";
import {CreateBasicTemplateDto} from "./dto/create-basic-template.dto";
import {UpdateBasicTemplateDto} from "./dto/update-basic-template.dto";
import {SalaryType} from "@prisma/client";
import {ApiConstant} from "../../../common/constant";

@Controller(ApiConstant.V1.BASIC_TEMPLATE)
export class BasicTemplateController {
  constructor(private readonly basicTemplateService: BasicTemplateService) {
  }

  @Post()
  async create(@Body() createBasicTemplateDto: CreateBasicTemplateDto) {
    return await this.basicTemplateService.create(createBasicTemplateDto);
  }

  @Get()
  async findAll(@Query("type") type: SalaryType) {
    return await this.basicTemplateService.findAll(type);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.basicTemplateService.findOne(+id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateBasicTemplateDto: UpdateBasicTemplateDto
  ) {
    return await this.basicTemplateService.update(+id, updateBasicTemplateDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.basicTemplateService.remove(+id);
  }
}
