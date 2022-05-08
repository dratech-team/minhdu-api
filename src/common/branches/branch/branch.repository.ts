import {BadRequestException, ForbiddenException, Injectable,} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateBranchDto} from "./dto/create-branch.dto";
import {AppEnum} from "@prisma/client";
import {UpdateBranchDto} from "./dto/update-branch.dto";
import {ProfileEntity} from "../../entities/profile.entity";
import {SearchBranchDto} from "./dto/search-branch.dto";

@Injectable()
export class BranchRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(profile: ProfileEntity, body: CreateBranchDto) {
    try {
      const acc = await this.prisma.account.findUnique({where: {id: profile.id}});
      if (!(acc.appName || acc)) {
        throw new ForbiddenException(`Account Chưa được phân quyền ${acc.appName + acc}. Vui lòng liên hệ admin.`);
      }
      const branch = await this.prisma.branch.create({
        data: {
          name: body.name,
          positions: body?.positionIds?.length ? {connect: body.positionIds.map(positionId => ({id: positionId}))} : {},
          address: body?.address,
          status: body.status ? {
            create: {
              app: acc.appName,
              status: body.status,
            }
          } : {},
          phone: body.phone ? {
            create: {
              app: acc.appName,
              phone: body.phone
            }
          } : {}
        },
        include: {
          positions: true,
          _count: true,
          allowances: true,
          status: true,
          phone: true
        }
      });
      return this.mapToBranch(branch);
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(profile: ProfileEntity, search: SearchBranchDto) {
    try {
      const acc = await this.prisma.account.findUnique({where: {id: profile.id}, include: {branches: true}});

      const [total, data] = await Promise.all([
        this.prisma.branch.count({
          where: {
            name: acc?.branches?.length ? {in: acc.branches.map(branch => branch.name)} : {},
          },
        }),
        this.prisma.branch.findMany({
          take: search?.take,
          skip: search?.skip,
          where: {
            name: acc?.branches?.length ? {in: acc.branches.map(branch => branch.name)} : {},
          },
          include: {
            positions: true,
            _count: true,
            allowances: true,
            status: true,
            phone: true
          }
        }),
      ]);
      return {total, data: await Promise.all(data.map(async branch => await this.mapToBranch(branch)))};
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(profile: ProfileEntity, id: number) {
    const acc = await this.prisma.account.findUnique({where: {id: profile.id}, include: {branches: true}});

    const branch = await this.prisma.branch.findUnique({
      where: {id},
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
        },
        positions: true
      },
    });
    return await this.mapToBranch(branch);
  }

  async update(profile: ProfileEntity, id: number, updates: UpdateBranchDto) {
    const acc = await this.prisma.account.findUnique({where: {id: profile.id}, include: {branches: true, role: true}});

    try {
      const branch = await this.prisma.branch.update({
        where: {id: id},
        data: {
          name: updates.name,
          positions: {set: updates?.positionIds?.map(id => ({id}))},
          phone: updates?.phone ? {
            upsert: {
              where: {
                app_branchId: {app: acc.appName, branchId: id},
              },
              update: {phone: updates.phone},
              create: {
                app: acc.appName,
                phone: updates.phone
              },
            }
          } : {},
          status: (updates?.status !== null && updates.status !== undefined) ? {
            upsert: {
              where: {
                app_branchId: {app: acc.appName, branchId: id},
              },
              update: {status: updates.status},
              create: {
                app: acc.appName,
                status: updates.status
              },
            }
          } : {}
        },
        include: {
          positions: true,
          _count: true,
          allowances: true,
          status: true,
          phone: true
        }
      });
      return await this.mapToBranch(branch);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.branch.delete({
        where: {id: id},
      });
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

  private async mapToBranch(branch) {
    return Object.assign(branch, {
        status: branch.status?.map(status => status.status)?.toString(),
        phone: branch.phone?.map(phone => phone.phone)?.toString(),
        _count: Object.assign(branch._count, {employeeLeft: await this.count(branch.id, true)})
      }
    );
  }
}
