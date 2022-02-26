import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateIncubatorDto} from "./dto/create-incubator.dto";
import {UpdateIncubatorDto} from "./dto/update-incubator.dto";
import {SearchIncubatorDto} from "./dto/search-incubator.dto";

@Injectable()
export class IncubatorRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateIncubatorDto) {
    try {
      return await this.prisma.incubator.create({
        data: {
          branch: {connect: {id: body.branchId}},
          createdAt: body.createdAt,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(search: SearchIncubatorDto) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.incubator.count({
          where: {
            branch: search?.branchId ? {id: search.branchId} : {},
            createdAt: {
              gte: search.startedAt,
              lte: search.endedAt,
            },
          }
        }),
        this.prisma.incubator.findMany({
          take: search?.take,
          skip: search?.skip,
          where: {
            branch: search?.branchId ? {id: search.branchId} : {},
            createdAt: {
              gte: search.startedAt,
              lte: search.endedAt,
            },
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
      return await this.prisma.incubator.findUnique({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdateIncubatorDto) {
    try {
      return await this.prisma.incubator.update({
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
      return await this.prisma.incubator.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
