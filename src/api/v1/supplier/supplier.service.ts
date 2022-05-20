import {BadRequestException, Injectable} from '@nestjs/common';
import {PrismaService} from "../../../prisma.service";
import {CreateSupplierDto} from "./dto/create-supplier.dto";
import {SearchSupplierDto} from "./dto/search-supplier.dto";
import {UpdateSupplierDto} from "./dto/update-supplier.dto";

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateSupplierDto) {
    try {
      return await this.prisma.supplier.create({
        data: {
          name: body.name
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(search: SearchSupplierDto) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.supplier.count(),
        this.prisma.supplier.findMany({
          take: search?.take,
          skip: search?.skip,
        })
      ]);
      return {total, data};
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.supplier.findUnique({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdateSupplierDto) {
    try {
      return await this.prisma.supplier.update({
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
      return await this.prisma.supplier.delete({
        where: {id}
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
