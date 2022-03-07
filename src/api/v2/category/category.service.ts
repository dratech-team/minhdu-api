import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateCategoryDto} from './dto/create-category.dto';
import {UpdateCategoryDto} from './dto/update-category.dto';
import {PrismaService} from "../../../prisma.service";
import {ProfileEntity} from "../../../common/entities/profile.entity";

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(profile: ProfileEntity, body: CreateCategoryDto) {
    try {
      const acc = await this.prisma.account.findUnique({where: {id: profile.id}});

      return await this.prisma.category.create({
        data: {
          name: body.name,
          branch: {connect: {id: body.branchId}},
          employees: body?.employeeIds?.length ? {connect: body.employeeIds.map(id => ({id}))} : {},
          app: acc.appName,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(profile: ProfileEntity) {
    try {
      const acc = await this.prisma.account.findUnique({
        where: {id: profile.id},
        include: {branches: true}
      });
      return await this.prisma.category.findMany({
        where: {
          app: acc.appName,
          branch: acc.branches?.length ? {id: {in: acc.branches.map(branch => branch.id)}} : {},
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.category.findUnique({
        where: {id},
        include: {
          employees: true,
          branch: true
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdateCategoryDto) {
    try {
      return await this.prisma.category.update({
        where: {id},
        data: {
          name: updates?.name,
          branch: updates?.branchId ? {connect: {id: updates.branchId}} : {},
          employees: updates?.employeeIds?.length ? {connect: updates.employeeIds.map(id => ({id}))} : {},
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.category.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async removeEmployee(id: number, employeeId: number) {
    try {
      return await this.prisma.category.update({
        where: {id},
        data: {
          employees: {disconnect: {id: employeeId}},
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
