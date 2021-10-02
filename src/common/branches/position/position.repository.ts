import {BadRequestException, Injectable,} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreatePositionDto} from "./dto/create-position.dto";
import {Position} from "@prisma/client";
import {UpdatePositionDto} from "./dto/update-position.dto";
import {OnePosition} from "./entities/position.entity";
import {ResponsePagination} from "../../entities/response.pagination";

@Injectable()
export class PositionRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreatePositionDto): Promise<Position> {
    try {
      return await this.prisma.position.create({
        data: {
          name: body.name,
          workday: body.workday,
        },
      });
    } catch (e) {
      const found = await this.prisma.position.findFirst({
        where: {name: body.name},
      });
      return await this.prisma.position.update({
        where: {id: found.id},
        data: {workday: body.workday},
      });
    }
  }

  async findAll(): Promise<ResponsePagination<Position>> {
    try {
      const [total, data] = await Promise.all([
        this.prisma.position.count(),
        this.prisma.position.findMany(),
      ]);
      return {total, data};
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findMany(search: CreatePositionDto): Promise<Position[]> {
    try {
      return await this.prisma.position.findMany({
        where: {
          name: search.name,
          workday: search.workday,
        },
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findOne(id: number): Promise<OnePosition> {
    try {
      return await this.prisma.position.findUnique({
        where: {id: id},
        include: {
          employees: true,
          workHistories: true,
          templates: true,
        },
      });
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findBranch(id: number): Promise<any> {
    try {
      return await this.prisma.position.findFirst({
        where: {id: id},
        include: {branches: true},
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdatePositionDto) {
    try {
      return await this.prisma.position.update({
        where: {id: id},
        data: updates,
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.position.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
