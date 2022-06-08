import {BadRequestException, Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Request, Response} from "express";
import {ApiConstant} from "../../../common/constant";
import {PrismaService} from "../../../prisma.service";
import {rangeDatetimeQuery} from "../../v1/salaries/common/queries/range-datetime.query";
import {DatetimeUnit, PartialDay} from "@prisma/client";

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
      OR: rangeDatetimeQuery(req.body?.startedAt, req.body?.endedAt),
    };
    const data = req.path.includes(ApiConstant.V1.SALARY.ALLOWANCE)
      ? await this.prisma.allowanceSalary.findMany({where: where})
      : req.path.includes(ApiConstant.V1.SALARY.OVERTIME)
        ? await this.prisma.overtimeSalary.findMany({where: where})
        : req.path.includes(ApiConstant.V1.SALARY.ABSENT)
          ? await this.prisma.absentSalary.findMany({where: where})
          : await this.prisma.remoteSalary.findMany({where: where});
    console.log((req.body as any))
    if (!req.path.includes(ApiConstant.V1.SALARY.ALLOWANCE) && data.length && (req.body as any)?.partial === PartialDay.ALL_DAY) {
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
