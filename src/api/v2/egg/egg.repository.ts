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
      return await this.prisma.egg.create({
        data: {
          type: {connect: {id: body.eggTypeId}},
          amount: body.amount,
          incubator: {connect: {id: body.incubatorId}},
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
            type: {name: {startsWith: search?.eggType, mode: "insensitive"}},
          }
        }),
        this.prisma.egg.findMany({
          take: search?.take,
          skip: search?.skip,
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
      return await this.prisma.egg.update({
        where: {id},
        data: {
          amount: updates.amount,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.egg.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
