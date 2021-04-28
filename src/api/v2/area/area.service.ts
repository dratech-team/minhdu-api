import {Area} from '.prisma/client';
import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {CreateAreaDto} from './dto/create-area.dto';
import {UpdateAreaDto} from './dto/update-area.dto';

@Injectable()
export class AreaService {
  constructor(
    private readonly service: PrismaService
  ) {
  }

  create(body: CreateAreaDto): Promise<Area> {
    return this.service.area.create({
      data: body
    });
  }

  findAll() {
    return `This action returns all area`;
  }

  findOne(id: number) {
    return `This action returns a #${id} area`;
  }

  update(id: number, updateAreaDto: UpdateAreaDto) {
    return `This action updates a #${id} area`;
  }

  remove(id: number) {
    return `This action removes a #${id} area`;
  }
}
