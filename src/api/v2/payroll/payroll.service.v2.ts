import {BadRequestException, Injectable} from "@nestjs/common";
import {PayrollRepository} from "./payroll.repository";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {firstDatetime, lastDatetime} from "../../../utils/datetime.util";
import {StatusEnum} from "../../../common/enum/status.enum";
import {isEqualDatetime} from "../../../common/utils/isEqual-datetime.util";
import * as moment from "moment";
import {EmployeeService} from "../employee/employee.service";
import {SearchPayrollDto} from "./dto/search-payroll.dto";
import {FilterTypeEnum} from "./entities/filter-type.enum";
import {timesheet} from "./functions/timesheet";
import {RecipeType} from "@prisma/client";
import {OnePayroll} from "./entities/payroll.entity";

@Injectable()
export class PayrollServicev2 {
  constructor(
    private readonly repository: PayrollRepository,
    private readonly employeeService: EmployeeService,
  ) {
  }

  async create(profile: ProfileEntity, body: CreatePayrollDto) {
    // Tạo hàng loạt
    if (!body?.employeeId) {
      const {data} = await this.employeeService.findAll(
        profile,
        {
          take: undefined,
          skip: undefined,
          createdAt: {
            datetime: lastDatetime(body.createdAt),
            compare: "lte"
          },
          status: StatusEnum.NOT_ACTIVE
        }
      );
      const createds = [];
      for (let i = 0; i < data.length; i++) {
        const payrolls = await this.repository.findAll(profile, {
          startedAt: firstDatetime(body.createdAt),
          endedAt: lastDatetime(body.createdAt),
          employeeId: data[i].id,
        });

        if (!payrolls.data.length) {
          const created = await this.repository.create(Object.assign(body, {
            createdAt: isEqualDatetime(body.createdAt, data[i].createdAt, "month") ? data[i].createdAt : body.createdAt,
            employeeId: data[i].id,
            branch: data[i].branch,
            position: data[i].position,
            recipeType: data[i].recipeType,
            workday: data[i].workday,
            isFlatSalary: data[i].isFlatSalary
          }));
          createds.push(created);
        }
      }

      return {
        status: 201,
        message: `Đã tự động tạo phiếu lương tháng ${moment(body.createdAt).format("MM/YYYY")} cho ${createds.length} nhân viên`,
      };
    } else {
      // Tạo 1
      const employee = await this.employeeService.findOne(body.employeeId);
      if (moment(employee.createdAt).isAfter(body.createdAt)) {
        throw new BadRequestException(`Không được tạo phiếu lương trước ngày nhân viên vào làm. Xin cảm ơn`);
      }
      return await this.repository.create(Object.assign(body, {
        employeeId: employee.id,
        branch: employee.branch,
        position: employee.position,
        recipeType: employee.recipeType,
        workday: employee.workday,
        isFlatSalary: employee.isFlatSalary,
      }), true);
    }
  }

  async findAll(profile: ProfileEntity, search?: Partial<SearchPayrollDto>) {
    const {total, data} = await this.repository.findAll(profile, search);

    return {
      total,
      data: data.map(payroll => {
        switch (search.filterType) {
          case FilterTypeEnum.TIME_SHEET: {
            return Object.assign(payroll, {timesheet: timesheet(payroll)});
          }
          case FilterTypeEnum.PAYROLL: {
          }
        }
      })
    };
  }

  private totalSalaryCTL(payroll: OnePayroll) {
    // const totalOvertime = this.
  }

  private totalOvertime(payroll: OnePayroll) {
    // payroll.overtimes.
  }
}
