import {BadRequestException, ConflictException, Injectable} from "@nestjs/common";
import {DatetimeUnit, Employee, Payroll, Role, Salary, SalaryType} from "@prisma/client";
import * as moment from "moment";
import {firstMonth, lastDayOfMonth, lastMonth} from "../../../utils/datetime.util";
import {EmployeeService} from "../employee/employee.service";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {UpdatePayrollDto} from "./dto/update-payroll.dto";
import {PayrollRepository} from "./payroll.repository";
import {SearchPayrollDto} from "./dto/search-payroll.dto";
import {ProfileEntity} from "../../../common/entities/profile.entity";
import {OnePayroll} from "./entities/payroll.entity";

@Injectable()
export class PayrollService {
    constructor(
        private readonly repository: PayrollRepository,
        private readonly employeeService: EmployeeService,
    ) {
    }

    async create(body: CreatePayrollDto) {
        try {
            throw new BadRequestException("Phiếu lương sẽ được hệ thống tự động khởi tạo khi đến tháng mới");
        } catch (err) {
            console.error(err);
            throw new ConflictException(err);
        }
    }

    async findAll(
        user: ProfileEntity,
        skip: number,
        take: number,
        search?: Partial<SearchPayrollDto>,
    ) {
        const employee = await this.employeeService.findAll(user, undefined, undefined, {branchId: user.branchId});

        ///
        await Promise.all(employee.data.map(async (employee) => {
            const payroll = await this.repository.findThisMonthForEmployeeId(employee.id);
            if (payroll.length > 1) {
                throw new BadRequestException(`Có gì đó không đúng. Nhân viên ${employee.lastName} tồn tại ${payroll.length} trong tháng này. Vui lòng xoá bớt 1 phiếu lương hoặc liên hệ admin để hỗ trợ. Xin cảm ơn.`);
            }
            if (payroll.length === 0) {
                await this.repository.create({employeeId: employee.id, createdAt: new Date()});
            }
        }));
        const data = await this.repository.findAll(user, skip, take, search);
        const payrolls = data.data.map(payroll => {
            if (payroll.manConfirmedAt) {
                return Object.assign(payroll, {total: this.totalSalary(payroll)});
            } else {
                return payroll;
            }
        });

        return {total: data.total, data: payrolls};
    }

    async findOne(id: number): Promise<OnePayroll> {
        const res = await this.repository.findOne(id);
        const payslip = res.manConfirmedAt !== null && res.salaries.length !== 0
            ? this.totalSalary(res)
            : null;
        return Object.assign(res, {payslip, actualDay: this.totalSalary(res).actualDay});
    }

    async findFirst(query: any): Promise<Payroll> {
        return await this.repository.findFirst(query);
    }

    /*
     * - Front end sẽ thêm salary mới và gửi id salary lên để connect vào phiếu lương
     *     + Nếu id salary thuộc type BASIC hoặc ALLOWANCE_STAYED thì sẽ được connect thêm tới lương của nhân viên
     *     + Ngược lại sẽ chỉ connect cho payroll
     * - Chặn edit phiếu lương sau khi phiếu lương đã xác nhận
     * - Quản lý xác phiếu lương,
     * - Quỹ Xác nhận đã thanh toán phiếu lương
     * */
    async update(id: number, updates: UpdatePayrollDto) {
        const payroll = await this.findOne(id);
        if (payroll.isEdit) {
            throw new BadRequestException(
                "Phiếu lương đã được tạo vì vậy bạn không có quyền sửa. Vui lòng liên hệ admin để được hỗ trợ."
            );
        }

        return await this.repository.update(id, updates);
    }

    async confirmPayroll(user: ProfileEntity, id: number) {
        switch (user.role) {
            case Role.CAMP_ACCOUNTING:
                return await this.repository.update(id, {accConfirmedAt: new Date()});
            case Role.CAMP_MANAGER:
                return await this.repository.update(id, {manConfirmedAt: new Date()});
            case Role.ACCOUNTANT_CASH_FUND:
                return await this.repository.update(id, {paidAt: new Date()});
            default:
                throw new BadRequestException("Bạn không có quyền xác nhận phiếu lương. Cảm ơn.");
        }
    }

    async remove(id: number) {
        return this.repository.remove(id);
    }

    totalAbsent(salaries: Salary[]) {
        let absent = 0;
        let late = 0;

        for (let i = 0; i < salaries.length; i++) {
            switch (salaries[i].type) {
                case SalaryType.ABSENT:
                    if (salaries[i].unit === DatetimeUnit.DAY) {
                        if (salaries[i].forgot) {
                            absent += salaries[i].times * 1.5;
                        } else {
                            absent += salaries[i].times;
                        }
                    } else {
                        late += salaries[i].times;
                    }

                    break;
            }
        }
        return absent + late;
    }

    /*
     * Tổng lương: result
     * Ngày làm thực tế: actual
     * Ngày công chuẩn: workday
     * Tổng lương cơ bản: basics
     * Tổng phụ cấp ở lại: stays
     * Tổng phụ cấp khác: allowances
     * Lương cố định: isFlat
     * Tổng ngày vắng: absents
     *
     * 1. actual > workday                  => result = (basics / workday) x actual + stays + allowances
     * 2. actual < workday                  => result = [(basics + stays) / workday] x actual + allowances
     * 3. isFlat === true && absents !== 0  => actual = workday (Dù tháng đó có bao nhiêu ngày đi chăng nữa). else quay lại 1 & 2
     * */
    totalSalary(payroll: any) {
        let basicSalary = 0;
        let tax = 0;
        let staySalary = 0;
        let allowanceSalary = 0;
        let overtime = 0;
        let absentTime = 0;
        let lateTime = 0;
        let daySalary = 0;
        let total = 0;

        /// TH nhân viên nghỉ ngang. Thì sẽ confirm phiếu lương => phiếu lương không được sửa nữa. và lấy ngày hiện tại
        let actualDay =
            !payroll.isEdit
                ? new Date().getDate() : lastDayOfMonth(payroll.createdAt) -
                this.totalAbsent(payroll.salaries);

        if (
            payroll.employee.isFlatSalary &&
            this.totalAbsent(payroll.salaries) === 0 && !payroll.isEdit
        ) {
            actualDay = 30;
        }

        for (let i = 0; i < payroll.salaries.length; i++) {
            switch (payroll.salaries[i].type) {
                case SalaryType.BASIC:
                    basicSalary += payroll.salaries[i].price;
                    break;
                case SalaryType.STAY:
                    staySalary += payroll.salaries[i].price;
                    break;
                case SalaryType.ALLOWANCE:
                    if (
                        payroll.salaries[i].times === null &&
                        payroll.salaries.datetime === null
                    ) {
                        payroll.salaries[i].times = 1;
                    }
                    allowanceSalary +=
                        payroll.salaries[i].times * payroll.salaries[i].price;
                    break;
                case SalaryType.OVERTIME:
                    /*
                     * Nếu lương x2 thì tính thêm 1 ngày vì ngày hiện tại vẫn đi làm*/
                    overtime += payroll.salaries[i].rate - 1;
                    break;
                case SalaryType.ABSENT:
                    if (payroll.salaries[i].unit === DatetimeUnit.HOUR) {
                        lateTime += payroll.salaries[i].times;
                    }
                    break;
            }
        }
        if (actualDay >= payroll.employee.position.workday) {
            daySalary = basicSalary / payroll.employee.position.workday;
        } else {
            daySalary =
                (basicSalary + staySalary) / payroll.employee.position.workday;
        }

        const basic = payroll.salaries.find(
            (salary) => salary.type === SalaryType.BASIC_INSURANCE
        );
        if (basic !== undefined) {
            tax = payroll.employee.contracts !== 0 ? basic.price * 0.115 : 0;
        }

        const deduction = (daySalary / 8) * lateTime + daySalary * absentTime;
        const allowanceOvertime = daySalary * overtime;

        if (actualDay >= payroll.employee.position.workday) {
            total =
                daySalary * actualDay +
                allowanceSalary +
                allowanceOvertime +
                staySalary -
                tax;
        } else {
            total = daySalary * actualDay + allowanceSalary + allowanceOvertime - tax;
        }
        return {
            basic: Math.ceil(basicSalary),
            stay: Math.ceil(staySalary),
            allowance: Math.ceil(allowanceSalary + allowanceOvertime),
            deduction,
            daySalary,
            actualDay,
            workday: payroll.employee.position.workday,
            salaryActual: Math.ceil(daySalary * actualDay),
            tax,
            total: Math.round(total / 1000) * 1000,
        };
    }
}
