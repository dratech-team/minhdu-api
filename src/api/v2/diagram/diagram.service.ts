import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDiagramDto } from './dto/create-diagram.dto';
import { UpdateDiagramDto } from './dto/update-diagram.dto';
import { PrismaService } from "../../../prisma.service";

@Injectable()
export class DiagramService {
  constructor(private readonly prisma: PrismaService) {
  }

  create(createDiagramDto: CreateDiagramDto) {
    return 'This action adds a new diagram';
  }

  async findAll() {
    try {
      return await this.prisma.branch.findMany({
        select: {
          id: true,
          name: true,
          departments: {
            select: {
              id: true,
              name: true,
              color: true,
              positions: {
                select: {
                  position: {
                    select: {
                      id: true,
                      name: true
                    }
                  }
                }
              }
            }
          }
        }
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} diagram`;
  }

  update(id: number, updateDiagramDto: UpdateDiagramDto) {
    return `This action updates a #${id} diagram`;
  }

  remove(id: number) {
    return `This action removes a #${id} diagram`;
  }
}
