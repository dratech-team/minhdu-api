import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateHolidayDto} from "./dto/create-holiday.dto";
import {UpdateHolidayDto} from "./dto/update-holiday.dto";
import {SearchHolidayDto} from "./dto/search-holiday.dto";
import {SalaryType} from "@prisma/client";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import * as _ from 'lodash';

@Injectable()
export class HolidayRepository {
  constructor(private readonly prisma: PrismaService) {
  }

  async create(body: CreateHolidayDto) {
    try {
      if (body.price && body.rate > 1) {
        throw new BadRequestException(
          "Nếu ngày lễ áp dụng cho khối văn phòng thì rate sẽ === 1"
        );
      }
      const holidays = await this.prisma.holiday.findMany({
        where: {
          positions: {every: {id: {in: body.positionIds}}},
          datetime: {in: body.datetime},
          price: body.price,
          isConstraint: body.isConstraint,
          rate: body.rate,
        }
      });

      if (holidays?.length) {
        throw new BadRequestException(`Ngày lễ ${body.datetime} đã tồn tại`);
      }

      return await this.prisma.holiday.create({
        data: {
          name: body.name,
          datetime: body.datetime,
          rate: body.rate,
          price: body.price,
          positions: {connect: body.positionIds.map((id) => ({id}))},
          isConstraint: body.isConstraint,
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findAll(take: number, skip: number, profile: ProfileEntity, search: Partial<SearchHolidayDto>) {
    try {
      const acc = await this.prisma.account.findUnique({
        where: {id: profile.id},
        include: {branches: {include: {positions: true}}}
      });
      const positionIds = _.flattenDeep(acc.branches.map(branch => branch.positions.map(position => position.id)));
      const [total, data] = await Promise.all([
        this.prisma.holiday.count({
          where: {
            name: {startsWith: search?.name},
            datetime: search?.datetime || undefined,
            rate: search?.rate || undefined,
            positions: {
              some: {id: {in: positionIds}}
            }
          },
        }),
        this.prisma.holiday.findMany({
          take: take || undefined,
          skip: skip || undefined,
          where: {
            name: {startsWith: search?.name},
            datetime: search?.datetime || undefined,
            rate: search?.rate || undefined,
            positions: {
              some: {id: {in: positionIds}}
            }
          },
          include: {
            positions: true,
          },
          orderBy: {
            datetime: "desc"
          }
        }),
      ]);
      return {
        total,
        data: data.map(holiday => ({
          ...holiday,
          positions: holiday.positions.filter(position => positionIds.includes(position.id))
        }))
      };
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async findOne(id: number, search?: Partial<SearchHolidayDto>) {
    try {
      const holiday = await this.prisma.holiday.findUnique({
        where: {id},
        include: {
          positions: true,
        },
      });

      if (!holiday) {
        throw new NotFoundException(`Not found by id ${id}`);
      }

      const salaries = await this.prisma.salary.findMany({
        where: {
          datetime: {
            in: holiday.datetime,
          },
          type: {in: [SalaryType.HOLIDAY]},
          payroll: {
            employee: {
              lastName: {startsWith: search?.name, mode: "insensitive"},
              branch: {name: {startsWith: search?.branch, mode: "insensitive"}},
              position: {name: {startsWith: search?.position, mode: "insensitive"}},
            },
          }
        },
        include: {
          payroll: {
            include: {
              employee: {
                include: {
                  position: true,
                  branch: true
                }
              }
            }
          }
        }
      });
      return {holiday, salaries};
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async update(id: number, updates: UpdateHolidayDto) {
    try {
      return await this.prisma.holiday.update({
        where: {id},
        data: {
          name: updates.name,
          datetime: updates.datetime,
          rate: updates.rate,
          positions: {set: updates.positionIds.map((id) => ({id}))},
          isConstraint: updates.isConstraint,
          price: updates.price,
        },
      });
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.holiday.delete({where: {id}});
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }

}
