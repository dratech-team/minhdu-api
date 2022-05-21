import {BaseRepository} from "../../../../common/repository/base.repository";
import {BadRequestException, Injectable} from "@nestjs/common";
import {PrismaService} from "../../../../prisma.service";
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

  async create(body: CreateOvertimeDto) {
    try {
      return await this.prisma.overtimeSalary.create({
        data: {
          payrollId: body.payrollId,
          startedAt: body.startedAt,
          endedAt: body.endedAt,
          startTime: body.startTime,
          endTime: body.endTime,
          partial: body.partial,
          allowances: body?.allowances ? {
            createMany: {data: body.allowances, skipDuplicates: true}
          } : {},
          blockId: body.blockId,
          settingId: body.settingId,
          note: body.note,
        }
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  // Không tạo được allowances trong overtime khi dùng createMany
  async createMany(bodys: CreateOvertimeDto[]) {
    try {
      const count = await Promise.all(bodys.map(async body => await this.create(body)));
      return {count: count.length};
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(search?: Partial<SearchOvertimeDto>) {
    try {
      const payroll = await this.prisma.payroll.findUnique({where: {id: search.payrollId}});

      const [total, data] = await Promise.all([
        this.prisma.overtimeSalary.count({
          where: {
            payrollId: payroll.id,
            setting: {
              title: {in: search?.titles, mode: "insensitive"},
            },
            partial: {in: search?.partial},
            OR: rangeDatetimeQuery(search?.startedAt || payroll.createdAt, search?.endedAt || lastDatetime(payroll.createdAt)),
          },
        }),
        this.prisma.overtimeSalary.findMany({
          take: search?.take,
          skip: search?.skip,
          where: {
            payrollId: search?.payrollId,
            setting: {
              title: {in: search?.titles, mode: "insensitive"},
            },
            partial: {in: search?.partial},
            OR: rangeDatetimeQuery(search?.startedAt || payroll.createdAt, search?.endedAt || lastDatetime(payroll.createdAt)),
          },
        }),
      ]);
      return {total, data};
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async groupBy(search?: Partial<SearchOvertimeDto>) {
    const payroll = search?.payrollId ? await this.prisma.payroll.findUnique({where: {id: search.payrollId}}) : null;
    const groupBy = await this.prisma.overtimeSalary.groupBy({
      by: [search.groupBy || "payrollId"],
      where: {
        payrollId: search?.payrollId,
        setting: {
          title: {in: search?.titles, mode: "insensitive"},
        },
        partial: {in: search?.partial},
        OR: rangeDatetimeQuery(search?.startedAt || payroll.createdAt, search?.endedAt || lastDatetime(payroll.createdAt)),
      },
    });

    return await Promise.all(groupBy.map(async e => {
      const {data} = await this.findAll(Object.assign(search, {payrollId: e.payrollId}));
      const payroll = await this.prisma.payroll.findUnique({where: {id: search.payrollId}, include: {employee: true}});
      return Object.assign(payroll, {overtimes: data});
    }));
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
      return await this.prisma.overtimeSalary.findUnique({where: {id: id}, include: {allowances: true}});
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

export type Subset<T, U> = {
  [key in keyof T]: key extends keyof U ? T[key] : never;
};
