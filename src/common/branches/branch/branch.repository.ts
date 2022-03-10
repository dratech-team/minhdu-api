import {BadRequestException, ForbiddenException, Injectable,} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateBranchDto} from "./dto/create-branch.dto";
import {AppEnum, Branch} from "@prisma/client";
import {UpdateBranchDto} from "./dto/update-branch.dto";
import {ProfileEntity} from "../../entities/profile.entity";

@Injectable()
export class BranchRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(profile: ProfileEntity, body: CreateBranchDto): Promise<Branch> {
    try {
      const acc = await this.prisma.account.findUnique({where: {id: profile.id}});
      if (acc.appName || !acc) {
        throw new ForbiddenException(`Account Chưa được phân quyền ${acc.appName + acc}. Vui lòng liên hệ admin.`);
      }
      return await this.prisma.branch.create({
        data: {
          name: body.name,
          positions: body?.positionIds?.length ? {connect: body.positionIds.map(positionId => ({id: positionId}))} : {},
          address: body?.address,
          status: {
            create: {
              app: acc.appName,
              status: body.status,
            }
          },
          phone: {
            create: {
              app: acc.appName,
              phone: body.phone
            }
          }
        },
        include: {
          positions: true
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(profile: ProfileEntity) {
    try {
      const acc = await this.prisma.account.findUnique({where: {id: profile.id}, include: {branches: true}});

      const branches = await this.prisma.branch.findMany({
        where: {
          name: acc.branches.length ? {in: acc.branches.map(branch => branch.name)} : {},
          status: {
            every: {
              app: acc.appName,
            }
          },
          phone: {
            every: {
              app: acc.appName,
            }
          }
        },
        include: {
          positions: acc.appName === AppEnum.HR,
          _count: acc.appName === AppEnum.HR,
          allowances: acc.appName === AppEnum.HR,
          status: true,
          phone: true
        }
      });
      return await Promise.all(branches.map(async branch => await this.mapToBranch(branch, acc.appName)));
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

  async findOne(profile: ProfileEntity, id: number) {
    const acc = await this.prisma.account.findUnique({where: {id: profile.id}, include: {branches: true}});

    const branch = await this.prisma.branch.findUnique({
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
        },
        positions: true
      },
    });
    return await this.mapToBranch(branch, acc.appName);
  }

  async update(id: number, updates: UpdateBranchDto) {
    try {
      return await this.prisma.branch.update({
        where: {id: id},
        data: {
          name: updates.name,
          positions: {set: updates.positionIds.map(id => ({id}))}
        },
        include: {
          allowances: true,
          positions: true
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

  private async mapToBranch(branch, appName: AppEnum) {
    return Object.assign(branch, {
        status: branch.status.map(status => status.status).toString(),
        phone: branch.phone.map(phone => phone.phone).toString()
      }, appName === AppEnum.HR
      ? {_count: Object.assign(branch._count, {employeeLeft: await this.count(branch.id, true)})}
      : {}
    );
  }
}
