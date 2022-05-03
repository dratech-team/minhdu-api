import {Body, Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {RemoteService} from './remote.service';
import {RemoveManyRemoteDto} from './dto';
import {ApiKeyGuard, JwtAuthGuard, RolesGuard} from "../../../../core/guard";
import {Roles} from "../../../../core/decorators/roles.decorator";
import {RoleEnum} from "@prisma/client";
import {CreateManyRemoteDto} from "./dto/create-many-remote.dto";
import {UpdateManyRemoteDto} from "./dto/update-many-remote.dto";

@UseGuards(JwtAuthGuard, ApiKeyGuard, RolesGuard)
@Controller('v2/salary/remote')
export class RemoteController {
  constructor(private readonly remoteService: RemoteService) {
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.CAMP_ACCOUNTING)
  @Post('/multiple/creation')
  create(@Body() createRemoteDto: CreateManyRemoteDto) {
    return this.remoteService.createMany(createRemoteDto);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get()
  findAll() {
    return this.remoteService.findAll();
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN, RoleEnum.HUMAN_RESOURCE, RoleEnum.CAMP_ACCOUNTING)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.remoteService.findOne(+id);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN)
  @Post('/multiple/updation')
  update(@Param('id') id: string, @Body() updateRemoteDto: UpdateManyRemoteDto) {
    return this.remoteService.update(+id, updateRemoteDto);
  }

  @Roles(RoleEnum.SUPPER_ADMIN, RoleEnum.ADMIN)
  @Post('/multiple/deletion')
  remove(@Body() body: RemoveManyRemoteDto) {
    return this.remoteService.removeMany(body);
  }
}
