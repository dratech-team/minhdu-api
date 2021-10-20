import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
} from "@nestjs/common";
import {BasicTemplateService} from "./basic-template.service";
import {CreateBasicTemplateDto} from "./dto/create-basic-template.dto";
import {UpdateBasicTemplateDto} from "./dto/update-basic-template.dto";
import {SalaryType} from "@prisma/client";

@Controller("v2/basic-template")
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
