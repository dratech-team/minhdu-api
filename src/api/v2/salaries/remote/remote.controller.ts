import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RemoteService } from './remote.service';
import { CreateRemoteDto } from './dto/create-remote.dto';
import { UpdateRemoteDto } from './dto/update-remote.dto';

@Controller('v2/salary/remote')
export class RemoteController {
  constructor(private readonly remoteService: RemoteService) {}

  @Post('/multiple/creation')
  create(@Body() createRemoteDto: CreateRemoteDto) {
    return this.remoteService.createMany(createRemoteDto);
  }

  @Get()
  findAll() {
    return this.remoteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.remoteService.findOne(+id);
  }

  @Post('/multiple/updation')
  update(@Param('id') id: string, @Body() updateRemoteDto: UpdateRemoteDto) {
    return this.remoteService.update(+id, updateRemoteDto);
  }

  @Post('/multiple/deletion')
  remove(@Param('id') id: string) {
    return this.remoteService.remove(+id);
  }
}
