import {BadRequestException, Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Request, Response} from "express";
import * as moment from "moment";
import {ApiV2Constant} from "../../../common/constant/api.constant";
import {PrismaService} from "../../../prisma.service";

@Injectable()
export class SalariesMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {
  }

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.body?.startedAt) {
      req.body.startedAt = new Date(moment(req.body?.startedAt).set({
        hours: 0,
        minutes: 0,
        seconds: 0
      }).format('YYYY-MM-DD'));
    }

    if (req.body?.endedAt) {
      req.body.endedAt = new Date(moment(req.body?.endedAt).set({
        hours: 0,
        minutes: 0,
        seconds: 0
      }).format('YYYY-MM-DD'));
    }

    const payrolls = await this.prisma.salary.findMany({
      where: {id: {in: (req.body as any)?.salaryIds}},
      select: {payrollId: true}
    });
    const where = {
      id: {notIn: (req.body as any)?.salaryIds},
      payroll: {id: {in: (req.body as any)?.payrollIds || payrolls.map(payroll => payroll.payrollId)}},
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
    console.log(data)
    if (data.length) {
      throw new BadRequestException("Có ngày nào đó đã tồn tại rồi. Vui lòng kiểm tra lại");
    }
    next();
  }
}
