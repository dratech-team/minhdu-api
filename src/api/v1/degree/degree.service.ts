import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateDegreeDto} from './dto/create-degree.dto';
import {UpdateDegreeDto} from './dto/update-degree.dto';
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class DegreeService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateDegreeDto) {
    try {
      return await this.prisma.degree.create({
        data: {
          employeeId: body.employeeId,
          type: body.type,
          startedAt: body.startedAt,
          endedAt: body.endedAt,
          formality: body.formality,
          status: body.status,
          level: body.level,
          school: body.school,
          major: body.major,
          note: body.note,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  findAll() {
    return `This action returns all degree`;
  }

  findOne(id: number) {
    return `This action returns a #${id} degree`;
  }

  async update(id: number, body: UpdateDegreeDto) {
    try {
      return await this.prisma.degree.update({
        where: {id},
        data: {
          employeeId: body.employeeId,
          type: body.type,
          startedAt: body.startedAt,
          endedAt: body.endedAt,
          formality: body.formality,
          status: body.status,
          level: body.level,
          school: body.school,
          major: body.major,
          note: body.note,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    return await this.prisma.degree.delete({where: {id}});
  }
}
