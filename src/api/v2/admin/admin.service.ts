import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateAdminDto} from './dto/create-admin.dto';
import {UpdateAdminDto} from './dto/update-admin.dto';
import {PrismaService} from "../../../prisma.service";
import {SearchAdminDto} from "./dto/search-admin.dto";
import {firstDatetime, lastDatetime} from "../../../utils/datetime.util";
import * as moment from "moment";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {
  }

  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  async findAll(take: number, skip: number, search: Partial<SearchAdminDto>) {
    try {
      const [total, branches] = await Promise.all([
        this.prisma.branch.count({
          take: take || undefined,
          skip: skip || undefined
        }),
        this.prisma.branch.findMany({
          take: take || undefined,
          skip: skip || undefined
        }),
      ]);

      const datetimes = (await this.prisma.payroll.groupBy({
        by: ['createdAt'],
        orderBy: {
          createdAt: "asc"
        }
      }));

      const yearsDiff = datetimes.reduce((acc, e) => {
        if (acc.length === 0) {
          return [...acc, e];
        }
        const year = moment(e.createdAt).year();
        if (acc.some((d => moment(d.createdAt).year() === year))) {
          return acc;
        }
        return [...acc, e];
      }, []);

      const data = await Promise.all(branches.map(async branch => {
        return {
          data: await Promise.all(yearsDiff.map(async e => {
            const payrolls = await this.prisma.payroll.findMany({
              where: {
                createdAt: {
                  gte: firstDatetime(e.createdAt, "years"),
                  lte: lastDatetime(e.createdAt, "years"),
                },
                employee: {
                  branchId: branch.id,
                }
              },
              select: {
                total: true,
              }
            });
            return {
              id: branch.id,
              name: `Bảng lương năm ${moment(e.createdAt).year()} của ${branch.name}`,
              branch: branch,
              type: "Lương theo năm",
              datetime: e.createdAt,
              total: payrolls.filter(payroll => payroll.total).map(payroll => payroll.total).reduce((a, b) => a + b, 0)
            };
          }))
        };
      }));
      return {total, data: data.map(e => e.data)};
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  async findOne(id: number, search: Partial<SearchAdminDto>) {
    try {
      if (!search?.year) {
        throw new BadRequestException('year required');
      }
      const branch = await this.prisma.branch.findUnique({
        where: {
          id: id
        }
      });
      return await Promise.all([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(async month => {
        const payrolls = await this.prisma.payroll.findMany({
          where: {
            createdAt: {
              gte: firstDatetime(new Date(`${search.year}-${month}-1`), "months"),
              lte: lastDatetime(new Date(`${search.year}-${month}-1`), "months"),
            },
            employee: {
              branchId: branch.id,
            }
          },
          select: {
            total: true,
          }
        });
        return {
          datetime: `${month}/${search.year}`,
          total: payrolls.filter(payroll => payroll.total).map(payroll => payroll.total).reduce((a, b) => a + b, 0)
        };
      }));
    } catch (e) {
      console.error(e);
      throw new BadRequestException(e);
    }
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
