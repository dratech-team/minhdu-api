import {BadRequestException, ConflictException, Injectable} from '@nestjs/common';
import {UpdatePayrollDto} from './dto/update-payroll.dto';
import {Salary, SalaryType} from '@prisma/client';
import * as moment from "moment";
import {PayrollRepository} from "./payroll.repository";
import {EmployeeService} from "../employee/employee.service";
import {SalaryService} from "../salary/salary.service";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {firstMonth, lastDayOfMonth, lastMonth} from "../../../utils/datetime.util";

@Injectable()
export class PayrollService {
  constructor(
    private readonly repository: PayrollRepository,
    private readonly employeeService: EmployeeService,
    private readonly salaryService: SalaryService,
  ) {
  }

  async create(body: CreatePayrollDto) {
    const first = firstMonth(body.createdAt);
    const last = lastMonth(body.createdAt);
    const payroll = await this.repository.findMany({first, last});
    if (payroll !== null) {
      throw new ConflictException(`Phiếu lương tháng ${moment(body.createdAt).format('MM/yyyy')} đã tồn tại.. Vui lòng kiểm tra kỹ lại trước khi thêm.. Tức cái lồng ngực á`);
    }
    const employee = await this.employeeService.findOne(body.employeeId);
    body.salaries = employee.salaries;
    return await this.repository.create(body.employeeId, body.salaries, body.createdAt);
  }

  async findAll(branchId: number, skip: number, take: number, search?: string, datetime?: Date) {
    const checkExist = await this.checkPayrollExist(branchId);
    if (checkExist) {
      const res = await this.repository.findAll(branchId, skip, take, search, datetime);
      return {
        total: res.total,
        data: res.data.map(payroll => this.returnPayroll(payroll)),
      };
    } else {
      throw new BadRequestException('Có Lỗi xảy ra ở payroll service. Vui lòng liên hệ developer để khắc phục. Xin cảm ơn');
    }
  }

  async findOne(id: number, isConfirm: boolean): Promise<any> {
    const payroll = await this.repository.findOne(id);
    if (isConfirm) {
      return this.totalSalary(payroll);
    }
    return this.returnPayroll(payroll);
  }

  /*
  * - Font end sẽ thêm salary mới và gửi id salary lên để connect vào phiếu lương
  *     + Nếu id salary thuộc type BASIC hoặc ALLOWANCE_STAYED thì sẽ được connect thêm tới lương của nhân viên
  *     + Ngược lại sẽ chỉ connect cho payroll
  * - Chặn edit phiếu lương sau khi phiếu lương đã xác nhận
  * - Quản lý xác phiếu lương,
  * - Quỹ Xác nhận đã thanh toán phiếu lương
  * */
  async update(id: number, updates: UpdatePayrollDto) {
    const payroll = await this.repository.update(id, updates);
    this.salaryService.findOne(updates.salaryId).then(salary => {
      if (salary.type === SalaryType.BASIC || salary.type === SalaryType.ALLOWANCE_STAYED) {
        this.employeeService.connectSalary(payroll.employeeId, updates.salaryId);
      }
    });
    return payroll;
  }

  async remove(id: number) {
    return `This action removes a #${id} payroll`;
  }

  returnPayroll(payroll: any) {
    return {
      id: payroll.id,
      isEdit: payroll.isEdit,
      confirmedAt: payroll.confirmedAt,
      paidAt: payroll.paidAt,
      createdAt: payroll.createdAt,
      salaries: payroll.salaries,
      employee: payroll.employee,
      actualDay: lastDayOfMonth(payroll.createdAt) - this.totalAbsent(payroll.salaries),
      payment: payroll.isEdit ? 'Đang xử lý' : this.totalSalary(payroll),
    };
  }

  totalAbsent(salaries: Salary[]) {
    let absent = 0;
    let late = 0;

    for (let i = 0; i < salaries.length; i++) {
      switch (salaries[i].type) {
        case SalaryType.ABSENT:
          if (salaries[i].forgot) {
            absent += salaries[i].times * 1.5;
          } else {
            absent += salaries[i].times;
          }
          break;
        case SalaryType.LATE:
          if (salaries[i].times === 4) {
            late += 0.5;
          }
      }
    }
    return absent + late;
  }

  totalSalary(payroll: any) {
    let basicSalary = 0;
    let staySalary = 0;
    let allowanceSalary = 0;
    let overtime = 0;
    let absentTime = 0;
    let lateTime = 0;
    let daySalary = 0;
    let actualDay = lastDayOfMonth(payroll.createdAt) - this.totalAbsent(payroll.salaries);

    if (payroll.employee.isFlatSalary && this.totalAbsent(payroll) === 0) {
      actualDay = 30;
    }

    for (let i = 0; i < payroll.salaries.length; i++) {
      switch (payroll.salaries[i].type) {
        case SalaryType.BASIC:
          basicSalary += payroll.salaries[i].price;
          break;
        case SalaryType.ALLOWANCE_STAYED:
          staySalary += payroll.salaries[i].price;
          break;
        case SalaryType.ALLOWANCE:
          if (payroll.salaries[i].times === null && payroll.salaries.datetime === null) {
            payroll.salaries[i].times = 1;
          }
          allowanceSalary += payroll.salaries[i].times * payroll.salaries[i].price;
          break;
        case SalaryType.OVERTIME:
          overtime += payroll.salaries[i].rate - 1;
          break;
        case SalaryType.LATE:
          lateTime += payroll.salaries[i].times;
          break;
      }
    }

    /*
    * Nếu ngày thực tế < ngày công chuẩn => lương 1 ngày = tổng lương cơ bản / ngày làm chuẩn và tiền phụ cấp
    * Ngược lại                          => lương 1 ngày = (tổng lương cơ bản + phụ cấp ở lại) / ngày làm chuẩn
    * ở lại = (tổng phụ cấp ở lại / số ngày làm việc chuẩn) * ngày làm thực tế
    * */
    if (actualDay < payroll.employee.position.workday) {
      daySalary = Math.ceil(basicSalary / payroll.employee.position.workday);
      staySalary = (staySalary / payroll.employee.position.workday) * actualDay;
    } else {
      daySalary = Math.ceil((basicSalary + staySalary) / payroll.employee.position.workday);
    }

    const basic = payroll.salaries.filter(salary => salary.title === 'Lương cơ bản trích BH')[0];

    const tax = payroll.employee.contractAt !== null ? basic.price * 0.115 : 0;
    const deduction = daySalary / 8 * lateTime + daySalary * absentTime;
    const allowanceOvertime = daySalary * overtime;
    const total = Math.ceil(((daySalary * actualDay) + allowanceSalary + staySalary + (daySalary * overtime)) - tax);

    return {
      basic: basicSalary,
      stay: staySalary,
      allowance: allowanceSalary + allowanceOvertime,
      deduction,
      actualDay,
      tax,
      daySalary,
      total: Math.round((total / 1000)) * 1000,
    };
  }

  /*
  * Kiểm tra phiếu lương của từng nhân viên đã tồn tại trong tháng này chưa?. Nếu chưa thì sẽ khởi tạo. Sau khi khởi
  * tạo xong hết danh sách nhân viên thì sẽ trả về true
  * */
  async checkPayrollExist(branchId: number): Promise<boolean> {
    const datetime = moment().format('MM/yyyy');
    try {
      const employees = await this.employeeService.findMany(branchId);

      for (let i = 0; i < employees.length; i++) {
        const count = employees[i].payrolls.filter(payroll => {
          const createdAt = moment(payroll.createdAt).format('MM/yyyy');
          return datetime == createdAt;
        });

        if (count.length > 1) {
          throw new BadRequestException(`Có gì đó không đúng. Các nhân viên ${employees[i].name} có nhiều hơn 2 phiếu lương trong tháng này`);
        } else if (count.length === 0) {
          await this.repository.create(employees[i].id, employees[i].salaries, new Date());
        }
      }
      return true;
    } catch (err) {
      console.error(err);
      throw new BadRequestException(err);
    }
  }
}

