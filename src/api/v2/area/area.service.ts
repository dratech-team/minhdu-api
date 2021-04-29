import {Area} from '.prisma/client';
import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {PrismaService} from '../../../prisma.service';
import {CreateAreaDto} from './dto/create-area.dto';
import {UpdateAreaDto} from './dto/update-area.dto';

@Injectable()
export class AreaService {
  constructor(
    private readonly service: PrismaService
  ) {
  }

  create(body: CreateAreaDto): Promise<Area> {
    return this.service.area.create({data: body});
  }

  findAll() {
    return this.service.area.findMany({include: {branches: true}});
  }

  findOne(id: number) {
    return this.service.area.findUnique({where: {id: id}, include: {branches: true}});
  }

  async update(id: number, updates: UpdateAreaDto): Promise<Area> {
    try {
      return await this.service.branch.update({where: {id: id}, data: updates});
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async remove(id: number): Promise<void> {
    await this.service.area.delete({where: {id: id}}).catch((e) => {
      throw new InternalServerErrorException(`Hiện khu vực này đang được liên kết với các chi nhánh. Bạn fai xoá các chi nhánh thuộc khu này trước khi xoá nó đi.`);
    });
  }
}
