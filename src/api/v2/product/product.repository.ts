import {BadRequestException, Injectable} from "@nestjs/common";
import {CreateProductDto} from "./dto/create-product.dto";
import {UpdateProductDto} from "./dto/update-product.dto";
import {PrismaService} from "../../../prisma.service";
import {SearchProductDto} from "./dto/search-product.dto";
import {ActionProduct} from "./entities/action-product.enum";

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
          branch: body?.branchId || body?.branch ? {
            connect: body?.branchId ? {id: body.branchId} : {name: body.name},
          } : {},
          warehouse: {
            connect: body?.warehouseId ? {id: body.warehouseId} : {name: body.warehouse}
          },
          price: body.price,
          amount: body.amount,
          discount: body.discount,
          provider: {
            connect: body?.providerId ? {id: body.providerId} : {name: body.provider}
          },
          note: body.note,
          unit: body.unit,
        },
        include: {
          provider: true,
          warehouse: true,
          branch: true
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(search: SearchProductDto) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.product.count({
          where: {
            name: search?.name ? {contains: search.name} : {},
            warehouse: search?.warehouseId ? {id: search.warehouseId} : {},
          },
        }),
        this.prisma.product.findMany({
          take: search?.take,
          skip: search?.skip,
          where: {
            name: search?.name ? {contains: search.name} : {},
            warehouse: search?.warehouseId ? {id: search.warehouseId} : {},
          },
          include: {
            provider: true,
            warehouse: true,
            branch: true
          },
        }),
      ]);
      return {total, data};
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
      const [from, des] = await Promise.all(
        [id, updates.desWarehouseId].map(async (id) => {
          return this.prisma.product.findUnique({
            where: {id: id},
          });
        })
      );
      switch (updates.action) {
        case ActionProduct.TRANSFER: {
          return await this.prisma.$transaction([
            this.prisma.product.update({
              where: {id},
              data: {
                amount: from.amount - updates.amount,
              },
            }),
            this.prisma.product.update({
              where: {id: updates.desWarehouseId},
              data: {
                amount: des.amount + updates.amount,
              },
            }),
          ]);
        }
        case ActionProduct.EXPORT: {
          return await this.prisma.product.update({
            where: {id},
            data: {
              amount: from.amount - updates.amount,
            },
          });
        }
        default: {
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
              branch: updates?.branchId
                ? {connect: {id: updates.branchId}}
                : {},
              warehouse: updates?.warehouseId
                ? {connect: {id: updates.warehouseId}}
                : {},
              price: updates.price,
              amount: updates.amount,
              discount: updates.discount,
              provider: updates?.providerId
                ? {connect: {id: updates.providerId}}
                : {},
              note: updates.note,
              unit: updates.unit,
            },
          });
        }
      }
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
