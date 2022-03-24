import {BadRequestException, Injectable, NotFoundException,} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateOvertimeTemplateDto} from "./dto/create-overtime-template.dto";
import {SearchOvertimeTemplateDto} from "./dto/search-overtime-template.dto";
import {UpdateOvertimeTemplateDto} from "./dto/update-overtime-template.dto";
import {ProfileEntity} from "../../../common/entities/profile.entity";

@Injectable()
export class OvertimeTemplateRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateOvertimeTemplateDto) {
    try {
      return await this.prisma.overtimeTemplate.create({
        data: {
          positions: {
            connect: body.positionIds?.map((positionId) => ({
              id: positionId,
            })),
          },
          branches: {connect: body.branchIds?.map(id => ({id}))},
          title: body.title,
          price: body.price,
          rate: body.rate,
          unit: body.unit,
          type: body.type,
          employeeType: body.employeeType,
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  // every: Search những id có trong id positionId và bao gồm overtime có positions null
  // some: Search những postitionId có trong overtime. k bao gồm positions rỗng
  async findAll(profile: ProfileEntity, search: SearchOvertimeTemplateDto) {
    try {
      const acc = await this.prisma.account.findUnique({where: {id: profile.id}, include: {branches: true}});
      const [total, data] = await Promise.all([
        this.prisma.overtimeTemplate.count({
          where: {
            title: {startsWith: search?.title, mode: "insensitive"},
            price: search?.price ? {in: search?.price} : {},
            unit: {in: search?.unit || undefined},
            branches: acc.branches?.length ? {
              some: {
                id: {in: acc.branches.map(branch => branch.id)}
              }
            } : search?.branchIds?.length ? {
              some: {id: {in: search?.branchIds}},
            } : {},
            positions: search?.positionIds?.length
              ? {some: {id: {in: search?.positionIds}}}
              : {},
          },
        }),
        this.prisma.overtimeTemplate.findMany({
          take: search?.take,
          skip: search?.skip,
          where: {
            title: {startsWith: search?.title, mode: "insensitive"},
            price: search?.price ? {in: search?.price} : {},
            unit: {in: search?.unit || undefined},
            branches: acc.branches?.length ? {
              some: {
                id: {in: acc.branches.map(branch => branch.id)}
              }
            } : search?.branchIds?.length ? {
              some: {id: {in: search?.branchIds}},
            } : {},
            positions: search?.positionIds?.length
              ? {some: {id: {in: search?.positionIds}}}
              : {},
          },
          include: {
            positions: true,
            branches: true,
          },
          orderBy: {
            title: "asc",
          },
        }),
      ]);
      return {total, data};
    } catch (err) {
      console.error(err);
      throw new NotFoundException(err);
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.overtimeTemplate.findUnique({
        where: {id},
        include: {
          positions: true,
          branches: true,
        },
      });
    } catch (err) {
      console.error(err);
      throw new NotFoundException(err);
    }
  }

  async update(id: number, updates: UpdateOvertimeTemplateDto) {
    try {
      return await this.prisma.overtimeTemplate.update({
        where: {id},
        data: {
          title: updates.title,
          unit: updates.unit,
          price: updates.price,
          rate: updates.rate,
          positions: {
            set: updates.positionIds?.map((id) => ({id})),
          },
          branches: {set: updates?.branchIds.map(id => ({id}))},
          employeeType: updates.employeeType,
        },
        include: {
          positions: true,
          branches: true,
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findFirst(query: any) {
    return await this.prisma.overtimeTemplate.findFirst(query);
  }

  async remove(id: number) {
    try {
      await this.prisma.overtimeTemplate.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
