import {BadRequestException, Injectable} from "@nestjs/common";
import {Salary, SalaryType} from "@prisma/client";
import {firstDatetimeOfMonth, lastDatetimeOfMonth} from "../../../utils/datetime.util";
import {EmployeeService} from "../employee/employee.service";
import {PayrollService} from "../payroll/payroll.service";
import {CreateSalaryDto} from "./dto/create-salary.dto";
import {UpdateSalaryDto} from "./dto/update-salary.dto";
import {OneSalary} from "./entities/salary.entity";
import {SalaryRepository} from "./salary.repository";
import {SearchSalaryDto} from "./dto/search-salary.dto";

@Injectable()
export class SalaryService {
  constructor(
    private readonly repository: SalaryRepository,
    private readonly employeeService: EmployeeService,
    private readonly payrollService: PayrollService
  ) {
  }

  async create(body: CreateSalaryDto): Promise<Salary | any> {
    const employees: string[] = [];
    const allowances: string[] = [];

    /// Thêm phụ cấp tăng ca hàng loạt
    if (body.employeeIds && body.employeeIds.length) {
      // get all payroll in body.datetime for employee
      const payrolls = await Promise.all(
        body.employeeIds.map(async (employeeId) => {
          return await this.findPayrollByEmployee(employeeId, body.datetime as Date);
        })
      );

      if (payrolls.length !== body.employeeIds.length) {
        throw new BadRequestException(`Có nhân viên nào đó chưa có bảng lương trong tháng ${body.datetime}. Vui lòng kiểm tra cho kỹ vào trước khi thêm nha.`);
      }

      for (let i = 0; i < payrolls.length; i++) {
        // Tạo overtime / absent trong payroll cho nhân viên
        //  Nếu body.allowEmpIds thì Thêm phụ cấp tiền ăn / phụ cấp trong giờ làm  tăng ca hàng loạt.  vì allowance đi chung với body nên cần dặt lại giá trị là null để nó khỏi gán cho nhân viên khác
        // copy obj body nếu k {} thì nó sẽ khi đè lên bên trong thuộc tính body và làm thay đổi giá trị body
        const salary = Object.assign({},
          body, {
            payrollId: payrolls[i].id,
            allowance: body?.allowEmpIds?.includes(payrolls[i].employeeId) && body.type === SalaryType.OVERTIME ? body?.allowance : null,
          }
        );

        const created = await this.repository.create(salary);
        if (created) {
          employees.push(created.payroll.employee.firstName + " " + created.payroll.employee.lastName);
        }
        if (created.allowance) {
          allowances.push(created.allowance?.title);
        }
      }
      return {
        status: 201,
        message: `Đã thêm ${body.title} cho ${employees.length} nhân viên. ${body.type === SalaryType.OVERTIME ? `Và ${allowances.length} phụ cấp` : ''}`
      };
    } else {
      /// get phụ cấp theo range ngày
      // const rageDate = (body as CreateSalaryByDayDto).datetime as RageDate;
      // if (!moment(rageDate?.start).isSame(rageDate?.end)) {
      //   const datetimes = getRange(rageDate?.start, rageDate?.end, "days");
      //   console.log(datetimes);
      // }
      return await this.repository.create(body);
    }
  }

  async findPayrollByEmployee(employeeId: number, datetime: Date) {
    // get payroll để lấy thông tin
    const payroll = await this.payrollService.findFirst({
      employeeId: employeeId,
      createdAt: {
        gte: firstDatetimeOfMonth(datetime),
        lte: lastDatetimeOfMonth(datetime),
      },
    });
    if (!payroll) {
      throw new BadRequestException(
        `Bảng lương tháng ${firstDatetimeOfMonth(datetime)} của mã nhân viên ${employeeId} không tồn tại. `
      );
    }
    return payroll;
  }

  async findOne(id: number): Promise<OneSalary> {
    return await this.repository.findOne(id);
  }

  async findAll(search: SearchSalaryDto) {
    return  await this.repository.findAll(search);

    /// TODO: Cọng dồn những tăng ca giống nhau
    // lọc theo overtime
    // if (!search?.employeeId) {
    //   const counts = {};
    //   salaries.forEach((x) => {
    //     counts[x] = (counts[x] || 0) + 1;
    //   });
    //   console.log(counts);
    // } else {
    //   // lọc theo thay đổi lương.
    // }

  }

  async update(id: number, updates: UpdateSalaryDto) {
    return await this.repository.update(id, updates);
  }

  async remove(id: number) {
    return this.repository.remove(id);
  }
}
