import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateProductDto) {
    try {
      return await this.prisma.product.create({
        data: {
          name: body.name,
          code: body.code,
          mfg: body.mfg,
          exp: body.exp,
          accountedAt: body.accountedAt,
          billedAt: body.billedAt,
          billCode: body.billCode,
          branch: {connect: {id: body.branchId}},
          type: {connect: {id: body.typeId}},
          price: body.price,
          amount: body.amount,
          discount: body.discount,
          provider: {connect: {id: body.providerId}},
          note: body.note,
          unit: body.unit,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      return await this.prisma.product.findMany();
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.product.findUnique({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdateProductDto) {
    try {
      return await this.prisma.product.update({
        where: {id},
        data: {
          name: updates.name,
          code: updates.code,
          mfg: updates.mfg,
          exp: updates.exp,
          accountedAt: updates.accountedAt,
          billedAt: updates.billedAt,
          billCode: updates.billCode,
          branch: updates?.branchId ? {connect: {id: updates.branchId}} : {},
          type: updates?.typeId ? {connect: {id: updates.typeId}} : {},
          price: updates.price,
          amount: updates.amount,
          discount: updates.discount,
          provider: updates?.providerId ? {connect: {id: updates.providerId}} : {},
          note: updates.note,
          unit: updates.unit,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.product.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
