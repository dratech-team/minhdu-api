import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RemoteService } from './remote.service';
import { CreateRemoteDto } from './dto/create-remote.dto';
import { UpdateRemoteDto } from './dto/update-remote.dto';

@Controller('remote')
export class RemoteController {
  constructor(private readonly remoteService: RemoteService) {}

  @Post()
  create(@Body() createRemoteDto: CreateRemoteDto) {
    return this.remoteService.create(createRemoteDto);
  }

  @Get()
  findAll() {
    return this.remoteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.remoteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRemoteDto: UpdateRemoteDto) {
    return this.remoteService.update(+id, updateRemoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.remoteService.remove(+id);
  }
}
