import {BadRequestException, Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Request, Response} from "express";
import {PrismaService} from "../../../../prisma.service";

@Injectable()
export class AllowanceMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const data = await this.prisma.allowanceSalary.findMany({
      where: {
        id: {notIn: (req.body as any).salaryIds},
        payroll: {id: {in: (req.body as any).payrollIds}},
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
      }
    });
    if (data.length) {
      throw new BadRequestException("Có ngày nào đó đã tồn tại rồi. Vui lòng kiểm tra lại");
    }
    return next();
  }
}
