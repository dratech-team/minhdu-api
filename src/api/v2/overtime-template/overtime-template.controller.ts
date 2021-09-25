import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { OvertimeTemplateService } from "./overtime-template.service";
import { CreateOvertimeTemplateDto } from "./dto/create-overtime-template.dto";
import { UpdateOvertimeTemplateDto } from "./dto/update-overtime-template.dto";
import { ApiV2Constant } from "../../../common/constant/api.constant";
import { DatetimeUnit } from "@prisma/client";

@Controller(ApiV2Constant.OVERTIME_TEMPLATE)
export class OvertimeTemplateController {
  constructor(private readonly service: OvertimeTemplateService) {}

  @Post()
  async create(@Body() body: CreateOvertimeTemplateDto) {
    return await this.service.create(body);
  }

  @Get()
  findAll(
    @Query("take") take: number,
    @Query("skip") skip: number,
    @Query("title") title: string,
    @Query("price") price: number,
    @Query("department") department: string,
    @Query("unit") unit: DatetimeUnit,
    @Query("positionId") positionId: number
  ) {
    return this.service.findAll(+take, +skip, {
      title,
      price: +price,
      department,
      unit,
      positionId: +positionId,
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updates: UpdateOvertimeTemplateDto) {
    return this.service.update(+id, updates);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.service.remove(+id);
  }
}
