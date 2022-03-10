import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common';
import {ProviderService} from './provider.service';
import {CreateProviderDto} from './dto/create-provider.dto';
import {UpdateProviderDto} from './dto/update-provider.dto';
import {SearchProviderDto} from "./dto/search-provider.dto";

@Controller('v2/provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {
  }

  @Post()
  create(@Body() createProviderDto: CreateProviderDto) {
    return this.providerService.create(createProviderDto);
  }

  @Get()
  findAll(@Query() search: SearchProviderDto) {
    return this.providerService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.providerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProviderDto: UpdateProviderDto) {
    return this.providerService.update(+id, updateProviderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.providerService.remove(+id);
  }
}
