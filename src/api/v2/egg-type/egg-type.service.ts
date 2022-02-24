import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateEggTypeDto} from './dto/create-egg-type.dto';
import {UpdateEggTypeDto} from './dto/update-egg-type.dto';
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class EggTypeService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateEggTypeDto) {
    try {
      return await this.prisma.eggType.create({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      return await this.prisma.eggType.findMany();
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.eggType.findUnique({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdateEggTypeDto) {
    try {
      return await this.prisma.eggType.update({
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
      return await this.prisma.eggType.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
