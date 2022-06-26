import {BadRequestException, Injectable} from "@nestjs/common";
import {BaseRepository} from "../../../../common/repository/base.repository";
import {PrismaService} from "../../../../prisma.service";
import {CreateAllowanceDto} from "./dto/create-allowance.dto";
import {RemoveManyAllowanceDto} from "./dto/remove-many-allowance.dto";
import {ProfileEntity} from "../../../../common/entities/profile.entity";
import {SearchAllowanceDto} from "./dto/search-allowance.dto";
import {AllowanceEntity} from "./entities";

@Injectable()
export class AllowanceRepository extends BaseRepository<AllowanceEntity> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(body: CreateAllowanceDto) {
    try {
      return await this.prisma.allowanceSalary.create({
        data: body
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async createMany(body: CreateAllowanceDto[]) {
    try {
      return await this.prisma.allowanceSalary.createMany({data: body});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(profile: ProfileEntity, search: Partial<SearchAllowanceDto>) {
    try {
      const acc = await this.prisma.account.findUnique({where: {id: profile.id}, include: {branches: true}});
      const [total, data] = await Promise.all([
        this.prisma.allowanceSalary.count(),
        this.prisma.allowanceSalary.findMany({
          take: search?.take,
          skip: search?.skip,
          where: {
            payroll: search?.payrollIds?.length ? {id: {in: search.payrollIds}} : search?.payrollId ? {id: search.payrollId} : {},
            startedAt: {
              lte: search?.startedAt,
            },
            endedAt: {
              gte: search?.endedAt
            },
          },
        }),
      ]);
      return {total, data};
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async count() {
    try {
      return await this.prisma.allowanceSalary.count();
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  findOne(id: number) {
    try {
      return 'This action adds a new allowance';
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async updateMany(ids: number[], body: CreateAllowanceDto) {
    try {
      return await this.prisma.allowanceSalary.updateMany({
        where: {id: {in: ids}},
        data: body,
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(body: RemoveManyAllowanceDto) {
    try {
      return await this.prisma.allowanceSalary.deleteMany({
        where: {id: {in: body.salaryIds}}
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
