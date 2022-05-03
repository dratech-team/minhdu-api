import {BadRequestException, Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction} from "express";
import {PrismaService} from "../../../../prisma.service";

@Injectable()
export class AllowanceMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {
  }

  async use(req: Request, res: Response, next: NextFunction) {
    await this.prisma.$use(async (params, next) => {
      if (params.action === "createMany" || params.action === "updateMany") {
        const data = await this.prisma.allowanceSalary.findMany({
          where: {
            payroll: {id: {in: (req.body as any).payrollIds}},
            startedAt: {
              lte: (req.body as any)?.startedAt,
            },
            endedAt: {
              gte: (req.body as any)?.endedAt
            },
          }
        });
        if (data.length) {
          throw new BadRequestException("exist");
        }
      }
      return await next(params);
    });
    return next();
  }
}
