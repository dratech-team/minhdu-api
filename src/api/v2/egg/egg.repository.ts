import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateEggDto} from "./dto/create-egg.dto";
import {UpdateEggDto} from "./dto/update-egg.dto";
import {SearchEggDto} from "./dto/search-egg.dto";

@Injectable()
export class EggRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateEggDto) {
    try {
      const found = await this.prisma.egg.findFirst({
        where: {
          createdAt: {in: body.createdAt},
          type: body.eggType,
        }
      });
      if (found) {
        return await this.prisma.egg.update({
          where: {id: found.id},
          data: {
            amount: found.amount + body.amount,
          }
        });
      }
      return await this.prisma.egg.create({
        data: {
          type: body.eggType,
          amount: body.amount,
          branch: {connect: {id: body.branchId}},
          createdAt: body.createdAt,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(search: SearchEggDto) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.egg.count({
          where: {
            type: search?.eggType ? {in: search?.eggType} : {},
            createdAt: {
              gte: search.startedAt,
              lte: search.endedAt
            }
          }
        }),
        this.prisma.egg.findMany({
          take: search?.take,
          skip: search?.skip,
          where: {
            type: search?.eggType ? {in: search?.eggType} : {},
            createdAt: {
              gte: search.startedAt,
              lte: search.endedAt
            }
          }
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
      return await this.prisma.egg.findUnique({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdateEggDto) {
    try {

    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {

    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
