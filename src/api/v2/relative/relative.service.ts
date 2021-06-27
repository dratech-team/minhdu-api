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
      return await this.prisma.relative.create({data: body});
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
      return await this.prisma.relative.update({
        where: {id},
        data: updates
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.relative.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
