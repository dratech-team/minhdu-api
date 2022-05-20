import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateApplicationDto} from './dto/create-application.dto';
import {UpdateApplicationDto} from './dto/update-application.dto';
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateApplicationDto) {
    try {
      return await this.prisma.application.create({data: body});
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      return await this.prisma.application.findMany();
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.application.findUnique({where: {id}});
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdateApplicationDto) {
    try {
      return await this.prisma.application.update({
        where: {id},
        data: updates,
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.application.delete({
        where: {id},
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
