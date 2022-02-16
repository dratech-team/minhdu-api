import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateProviderDto} from './dto/create-provider.dto';
import {UpdateProviderDto} from './dto/update-provider.dto';
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class ProviderService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateProviderDto) {
    try {
      console.log(body);
      return await this.prisma.provider.create({
        data: {
          name: body.name
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      return await this.prisma.provider.findMany();
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.provider.findUnique({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdateProviderDto) {
    try {
      return await this.prisma.provider.update({
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
      return await this.prisma.provider.delete({
        where: {id}
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
