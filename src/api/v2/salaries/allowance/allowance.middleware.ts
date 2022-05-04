import {BadRequestException, Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction} from "express";
import {PrismaService} from "../../../../prisma.service";
import * as moment from "moment";

@Injectable()
export class AllowanceMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const startedAt = new Date(moment((req.body as any)?.startedAt).set({
      hours: 0,
      minutes: 0,
      seconds: 0
    }).format('YYYY-MM-DD'));
    const endedAt = new Date(moment((req.body as any)?.endedAt).set({
      hours: 0,
      minutes: 0,
      seconds: 0
    }).format('YYYY-MM-DD'));

    if (req.method === "POST") {
      const data = await this.prisma.allowanceSalary.findMany({
        where: {
          id: req.method === "POST" ? {notIn: (req.body as any).salaryIds} : {},
          payroll: {id: {in: (req.body as any).payrollIds}},
          OR: [
            {
              AND: [
                {
                  startedAt: {
                    lte: startedAt,
                  },
                },
                {
                  endedAt: {
                    gte: endedAt
                  },
                }
              ]
            },
            {
              OR: [
                {
                  startedAt: {
                    gte: startedAt,
                    lte: endedAt,
                  },
                },
                {
                  endedAt: {
                    gte: startedAt,
                    lte: endedAt,
                  },
                }
              ]
            },
          ]
        }
      });
      if (data.length) {
        throw new BadRequestException("Có ngày nào đó đã tồn tại rồi. Vui lòng kiểm tra lại");
      }
    }
    return next();
  }
}
