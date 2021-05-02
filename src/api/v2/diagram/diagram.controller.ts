import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiagramService } from './diagram.service';
import { CreateDiagramDto } from './dto/create-diagram.dto';
import { UpdateDiagramDto } from './dto/update-diagram.dto';

@Controller('v2/diagram')
export class DiagramController {
  constructor(private readonly diagramService: DiagramService) {}

  @Post()
  create(@Body() createDiagramDto: CreateDiagramDto) {
    return this.diagramService.create(createDiagramDto);
  }

  @Get()
  findAll() {
    return this.diagramService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diagramService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiagramDto: UpdateDiagramDto) {
    return this.diagramService.update(+id, updateDiagramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diagramService.remove(+id);
  }
}
