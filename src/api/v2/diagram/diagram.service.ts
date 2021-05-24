import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateDiagramDto} from './dto/create-diagram.dto';
import {UpdateDiagramDto} from './dto/update-diagram.dto';
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class DiagramService {
  constructor(private readonly prisma: PrismaService) {
  }

  create(createDiagramDto: CreateDiagramDto) {
    return 'This action adds a new diagram';
  }

  async findAll() {
    return 'diagram getAll';
  }

  async findOne() {
    return 'development';
  }

  async update(departmentId: number, positionId: number, update: UpdateDiagramDto) {
  }

  remove(id: number) {
    return `This action removes a #${id} diagram`;
  }
}
