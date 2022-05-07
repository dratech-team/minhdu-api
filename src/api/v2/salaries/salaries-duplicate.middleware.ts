import {BadRequestException, Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Request, Response} from "express";
import {ApiV2Constant} from "../../../common/constant/api.constant";
import {PrismaService} from "../../../prisma.service";
import {PartialDay} from "@prisma/client";
import * as dateFns from 'date-fns';

// check đã tồn tại ngày của block đó
@Injectable()
export class SalariesDuplicateMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const payrolls = await this.prisma.payroll.findMany({
      where: {id: {in: (req.body as any)?.salaryIds}},
      select: {id: true}
    });
    const where = {
      id: {notIn: (req.body as any)?.salaryIds},
      payroll: {id: {in: (req.body as any)?.payrollIds || payrolls.map(payroll => payroll.id)}},
      OR: [
        {
          AND: [
            {
              startedAt: {
                lte: req.body?.startedAt,
              },
            },
            {
              endedAt: {
                gte: req.body?.endedAt
              },
            }
          ]
        },
        {
          OR: [
            {
              startedAt: {
                gte: req.body?.startedAt,
                lte: req.body?.endedAt,
              },
            },
            {
              endedAt: {
                gte: req.body?.startedAt,
                lte: req.body?.endedAt,
              },
            }
          ]
        },
      ]
    };
    const data = req.path.includes(ApiV2Constant.SALARY.ALLOWANCE)
      ? await this.prisma.allowanceSalary.findMany({where: where})
      : req.path.includes(ApiV2Constant.SALARY.OVERTIME)
        ? await this.prisma.overtimeSalary.findMany({where: where})
        : req.path.includes(ApiV2Constant.SALARY.ABSENT)
          ? await this.prisma.absentSalary.findMany({where: where})
          : await this.prisma.remoteSalary.findMany({where: where});
    if (!req.path.includes(ApiV2Constant.SALARY.ALLOWANCE) && data.length) {
      throw new BadRequestException("Có ngày nào đó đã tồn tại rồi. Vui lòng kiểm tra lại");
    }
    // if (req.path.includes(ApiV2Constant.SALARY.ALLOWANCE) || req.path.includes(ApiV2Constant.SALARY.OVERTIME)) {
    //   const data = await this.prisma.absentSalary.findMany({where: where});
    //
    //   if (
    //     data.length
    //     && data.filter(absent => {
    //       const range = dateFns.eachDayOfInterval({
    //         start: absent.startedAt,
    //         end: absent.endedAt,
    //       }).map(absent => absent.getTime());
    //       return absent.partial === (req.body as any).partial && range.includes();
    //     }).length
    //   ) {
    //     throw new BadRequestException("Có ngày nào đó đã tồn tại trong mục vắng rồi. Vui lòng kiểm tra lại");
    //   }
    // }
    next();
  }
}
