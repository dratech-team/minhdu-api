import {BadRequestException, Injectable,} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateBranchDto} from "./dto/create-branch.dto";
import {Branch} from "@prisma/client";
import {UpdateBranchDto} from "./dto/update-branch.dto";

@Injectable()
export class BranchRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateBranchDto): Promise<Branch> {
    try {
      return await this.prisma.branch.create({
        data: {
          name: body.name,
          positions: body?.positionIds?.length ? {connect: body.positionIds.map(positionId => ({id: positionId}))} : {}
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll() {
    try {
      return await this.prisma.branch.findMany({
        include: {
          _count: true,
          allowances: true,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findMany(search: CreateBranchDto): Promise<Branch[]> {
    try {
      return await this.prisma.branch.findMany({
        where: {
          name: search.name,
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    return await this.prisma.branch.findUnique({
      where: {id: id},
      include: {
        _count: {
          select: {
            employees: true,
          }
        },
        allowances: {
          select: {
            id: true,
            title: true,
            datetime: true,
            price: true
          },
          orderBy: {
            datetime: "asc"
          }
        }
      },
    });
  }

  async update(id: number, updates: UpdateBranchDto) {
    try {
      return await this.prisma.branch.update({
        where: {id: id},
        data: {
          name: updates.name,
          positions: updates?.positionIds?.length ? {set: updates.positionIds.map(id => ({id}))} : {}
        },
        include: {
          allowances: true
        }
      });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.branch.delete({where: {id: id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException("Không thể xóa.", err);
    }
  }

  async removeAlowance(id: number) {
    try {
      const salary = await this.prisma.salary.findUnique({
        where: {id},
        select: {branchId: true}
      });
      await this.prisma.salary.delete({
        where: {id: id}
      });
      return this.prisma.branch.findUnique({
        where: {id: salary.branchId},
        include: {
          allowances: true
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException("Không thể xóa.", err);
    }
  }

  async count(branchId: number, isLeft: boolean) {
    try {
      return await this.prisma.employee.count({
        where: {
          branchId: branchId,
          leftAt: isLeft ? {notIn: null} : {in: null}
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
