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
          branch: body?.branchId ? {connect: {id: body?.branchId}} : {},
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
  async findAll(
    take: number,
    skip: number,
    profile: ProfileEntity,
    search: Partial<SearchOvertimeTemplateDto>
  ) {
    try {
      const [total, data] = await Promise.all([
        this.prisma.overtimeTemplate.count({
          where: {
            title: {startsWith: search?.title, mode: "insensitive"},
            price: search?.price ? {in: search?.price} : {},
            unit: {in: search?.unit || undefined},
            AND: {
              branch: profile.branches?.length
                ? {id: {in: profile.branches.map(branch => branch.id)}}
                : !profile.branches?.length && search?.branchId
                  ? {id: search.branchId}
                  : {},
              positions: search?.positionIds?.length
                ? {
                  some: {id: {in: search?.positionIds}},
                }
                : {},
            }
          },
        }),
        this.prisma.overtimeTemplate.findMany({
          take: take || undefined,
          skip: skip || undefined,
          where: {
            title: {startsWith: search?.title, mode: "insensitive"},
            price: search?.price ? {in: search?.price} : {},
            unit: {in: search?.unit || undefined},
            AND: {
              branch: profile.branches?.length
                ? {id: {in: profile.branches.map(branch => branch.id)}}
                : !profile.branches?.length && search?.branchId
                  ? {id: search.branchId}
                  : {},
              positions: search?.positionIds?.length
                ? {
                  some: {id: {in: search?.positionIds}},
                }
                : {},
            }
          },
          include: {
            positions: true,
            branch: true,
          },
          orderBy: {
            price: "desc",
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
          branch: true,
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
          branch: updates?.branchId
            ? {connect: {id: updates?.branchId}}
            : {disconnect: true},
          employeeType: updates.employeeType,
        },
        include: {
          positions: true,
          branch: true,
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
