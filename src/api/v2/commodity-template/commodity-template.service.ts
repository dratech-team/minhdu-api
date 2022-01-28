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
      return await this.prisma.commodityTemplate.findMany();
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findOne(id: number) {
    try {

    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async update(id: number, updateCommodityTemplateDto: UpdateCommodityTemplateDto) {
    try {

    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async remove(id: number) {
    try {

    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }
}
