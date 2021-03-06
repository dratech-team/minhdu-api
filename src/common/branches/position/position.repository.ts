import {BadRequestException, Injectable,} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreatePositionDto} from "./dto/create-position.dto";
import {Position} from "@prisma/client";
import {UpdatePositionDto} from "./dto/update-position.dto";
import {OnePosition} from "./entities/position.entity";
import {SearchPositionDto} from "./dto/search-position.dto";
import {ProfileEntity} from "../../entities/profile.entity";
import * as _ from 'lodash';

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
          branches: body?.branchIds?.length ? {connect: body.branchIds.map(id => ({id: +id}))} : {},
        },
        include: {
          branches: true,
          _count: true
        }
      });

      Promise.all(body?.branchIds?.map(async branchId => {
        this.prisma.branch.update({
          where: {id: branchId},
          data: {
            positions: {connect: {id: position.id}}
          }
        }).then();
      })).then();

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

  async findAll(profile: ProfileEntity, search: Partial<SearchPositionDto>) {
    try {
      const acc = await this.prisma.account.findUnique({where: {id: profile.id}, include: {branches: true}});
      if (acc.branches?.length) {
        if (search?.branchId) {
          const branch = await this.prisma.branch.findUnique({
            where: {id: search.branchId},
            include: {positions: true}
          });
          return branch.positions;
        } else {
          const branchIds = acc.branches.map(branch => branch.id);
          const branches = await Promise.all(branchIds.map(async branchId => {
            return await this.prisma.branch.findUnique({where: {id: branchId}, include: {positions: true}});
          }));
          return _.flattenDeep(branches.map(branch => branch.positions));
        }
      }
      const [total, data] = await Promise.all([
        this.prisma.position.count({
          where: {
            name: {startsWith: search?.position, mode: "insensitive"},
            workday: search?.workday,
          },
        }),
        this.prisma.position.findMany({
          where: {
            name: {startsWith: search?.position, mode: "insensitive"},
            workday: search?.workday,
          },
          include: {
            branches: true,
            _count: true
          }
        }),
      ]);
      return {total, data};
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
          branches: true,
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
          branches: updates?.branchIds?.length ? {set: updates.branchIds?.map((id) => ({id: +id}))} : {}
        },
        include: {
          branches: true,
          _count: true
        }
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
