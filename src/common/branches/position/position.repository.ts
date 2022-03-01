import {BadRequestException, Injectable,} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreatePositionDto} from "./dto/create-position.dto";
import {Position} from "@prisma/client";
import {UpdatePositionDto} from "./dto/update-position.dto";
import {OnePosition} from "./entities/position.entity";
import {SearchPositionDto} from "./dto/search-position.dto";

@Injectable()
export class PositionRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreatePositionDto): Promise<Position> {
    try {
      const position = await this.prisma.position.create({
        data: {
          name: body.name,
          workday: body.workday,
        },
      });

      if (body?.branchId) {
        await this.prisma.branch.update({
          where: {id: body.branchId},
          data: {
            positions: {connect: {id: position.id}}
          }
        });
      }

      return position;
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

  async findAll(search: Partial<SearchPositionDto>): Promise<Position[]> {
    try {
      return await this.prisma.position.findMany({
        where: {
          name: {startsWith: search?.position, mode: "insensitive"},
          workday: search?.workday,
        },
        include: {
          _count: true
        }
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
        data: {
          name: updates?.name,
          workday: updates?.workday,
          branches: updates?.branchId ? {connect: {id: updates.branchId}} : {},
        },
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
