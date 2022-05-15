import {BaseRepository} from "../../../../common/repository/base.repository";
import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../../prisma.service";
import {CreateManyOvertimeDto} from "./dto/create-many-overtime.dto";
import {UpdateOvertimeDto} from "./dto/update-overtime.dto";
import {CreateOvertimeDto} from "./dto/create-overtime.dto";
import {RemoveManyOvertimeDto} from "./dto/remove-many-overtime.dto";
import {OvertimeEntity} from "./entities";
import {SearchOvertimeDto} from "./dto/search-overtime.dto";
import {lastDatetime} from "../../../../utils/datetime.util";
import {rangeDatetimeQuery} from "../common/queries/range-datetime.query";

@Injectable()
export class OvertimeRepository extends BaseRepository<OvertimeEntity> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(body: CreateManyOvertimeDto) {
    try {
      return 'Chưa làm';
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async createMany(bodys: CreateOvertimeDto[]) {
    try {
      return await this.prisma.overtimeSalary.createMany({data: bodys});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(search?: Partial<SearchOvertimeDto>) {
    try {
      const payroll = search?.payrollId ? await this.prisma.payroll.findUnique({where: {id: search.payrollId}}) : null;
      const [total, data] = await Promise.all([
        this.prisma.overtimeSalary.count({
          where: {
            payrollId: search?.payrollId,
            setting: {
              title: {in: search?.titles, mode: "insensitive"},
            },
            partial: {in: search?.partial},
            OR: rangeDatetimeQuery(search?.startedAt || payroll.createdAt, search?.endedAt || lastDatetime(payroll.createdAt)),
          }
        }),
        this.prisma.overtimeSalary.findMany({
          where: {
            payrollId: search?.payrollId,
            setting: {
              title: {in: search?.titles, mode: "insensitive"},
            },
            partial: {in: search?.partial},
            OR: rangeDatetimeQuery(search?.startedAt || payroll.createdAt, search?.endedAt || lastDatetime(payroll.createdAt)),
          }
        }),
      ]);
      return {total, data};
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async count(search?: Partial<SearchOvertimeDto>) {
    try {
      return await this.prisma.overtimeSalary.count({
        where: {
          setting: {title: {in: search?.titles, mode: "insensitive"}},
          partial: {in: search?.partial},
          payrollId: {in: search?.payrollId},
          OR: rangeDatetimeQuery(search.startedAt, search.endedAt),
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number) {
    try {
      return `Chưa làm`;
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, body: UpdateOvertimeDto) {
    try {
      return `Chưa làm`;
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async updateMany(ids: number[], body: CreateOvertimeDto) {
    try {
      return await this.prisma.overtimeSalary.updateMany({
        where: {id: {in: ids}},
        data: body
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      return `Chưa làm`;
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async removeMany(body: RemoveManyOvertimeDto) {
    try {
      return await this.prisma.overtimeSalary.deleteMany({where: {id: {in: body.salaryIds}}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}
