import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateWarehouseDto} from './dto/create-warehouse.dto';
import {UpdateWarehouseDto} from './dto/update-warehouse.dto';
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class ProductCategoryService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateWarehouseDto) {
    try {
      return await this.prisma.productCategory.create({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      return await this.prisma.productCategory.findMany();
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.productCategory.findUnique({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdateWarehouseDto) {
    try {
      return await this.prisma.productCategory.update({
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
      return await this.prisma.productCategory.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
