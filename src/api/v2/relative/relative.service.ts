import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateRelativeDto} from './dto/create-relative.dto';
import {UpdateRelativeDto} from './dto/update-relative.dto';
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class RelativeService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateRelativeDto) {
    try {
      const created = await this.prisma.relative.create({data: body});
      return await this.prisma.employee.findUnique({where: {id: created.employeeId}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  findAll() {
  }

  findOne(id: number) {
    return `This action returns a #${id} relative`;
  }

  async update(id: number, updates: UpdateRelativeDto) {
    try {
      const updated = await this.prisma.relative.update({
        where: {id},
        data: updates
      });
      return await this.prisma.employee.findUnique({where: {id: updated.employeeId}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      const deleted = await this.prisma.relative.delete({where: {id}});
      return await this.prisma.employee.findUnique({where: {id: deleted.employeeId}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
