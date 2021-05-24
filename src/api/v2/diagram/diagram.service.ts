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
    let data = [];
    try {
      const diagrams = await this.prisma.departmentToPosition.findMany({
        select: {
          position: true,
          department: true,
          workday: true,
        }
      });
      diagrams.map((diagram) => {
        data.push({
          departmentId: diagram.department.id,
          positionId: diagram.position.id,
          workday: diagram.workday,
        });
      });
      return data;
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findOne() {
    return 'development';
  }

  async update(departmentId: number, positionId: number, update: UpdateDiagramDto) {
    return await this.prisma.departmentToPosition.update({
      where: {
        departmentId_positionId: {
          departmentId: departmentId,
          positionId: positionId,
        }
      },
      data: update
    });
  }

  remove(id: number) {
    return `This action removes a #${id} diagram`;
  }
}
