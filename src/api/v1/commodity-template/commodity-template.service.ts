import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateCommodityTemplateDto} from './dto/create-commodity-template.dto';
import {UpdateCommodityTemplateDto} from './dto/update-commodity-template.dto';
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class CommodityTemplateService {
  constructor(private prisma: PrismaService) {
  }

  async create(body: CreateCommodityTemplateDto) {
    try {
      return await this.prisma.commodityTemplate.create({
        data: body
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findAll() {
    try {
      const [total, data] = await Promise.all([
        this.prisma.commodityTemplate.count(),
        this.prisma.commodityTemplate.findMany()
      ]);
      return {total, data};
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.commodityTemplate.findUnique({where: {id}});
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async update(id: number, update: UpdateCommodityTemplateDto) {
    try {
      return await this.prisma.commodityTemplate.update({where: {id}, data: update});
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.commodityTemplate.delete({where: {id}});
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }
}
