import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateOvertimeTemplateDto} from './dto/create-overtime-template.dto';
import {UpdateOvertimeTemplateDto} from './dto/update-overtime-template.dto';
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class OvertimeTemplateService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateOvertimeTemplateDto) {
    try {
      return await this.prisma.overtimeTemplate.create({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      return await this.prisma.overtimeTemplate.findMany();
    } catch (err) {
      console.error(err);
      throw new NotFoundException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.overtimeTemplate.findUnique({where: {id}});
    } catch (err) {
      console.error(err);
      throw new NotFoundException(err);
    }
  }

  async update(id: number, updates: UpdateOvertimeTemplateDto) {
    try {
      return await this.prisma.overtimeTemplate.update({
        where: {id},
        data: updates,
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.overtimeTemplate.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
