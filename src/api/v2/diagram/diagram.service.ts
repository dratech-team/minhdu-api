import {Injectable} from '@nestjs/common';
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
    return await this.prisma.area.findMany({
      select: {
        name: true,
        branches: {
          select: {
            name: true,
            departments: {
              select: {
                department: {
                  select: {
                    name: true,
                    positions: {
                      select: {
                        position: {
                          select: {
                            name: true
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
    });
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
