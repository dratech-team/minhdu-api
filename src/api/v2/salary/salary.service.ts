import {BadRequestException, Injectable} from "@nestjs/common";
import {Salary, SalaryType} from "@prisma/client";
import {CreateSalaryDto, CreateSalaryEmployeesDto} from "./dto/create-salary.dto";
import {UpdateSalaryDto} from "./dto/update-salary.dto";
import {SalaryRepository} from "./salary.repository";
import {EmployeeService} from "../employee/employee.service";
import {PayrollService} from "../payroll/payroll.service";
import {firstMonth, lastMonth} from "../../../utils/datetime.util";
import {HistorySalaryService} from "../histories/history-salary/history-salary.service";
import {OmitType} from "@nestjs/swagger";
import {OneSalary} from "./entities/salary.entity";

@Injectable()
export class SalaryService {
    constructor(
        private readonly repository: SalaryRepository,
        private readonly employeeService: EmployeeService,
        private readonly payrollService: PayrollService,
    ) {
    }

    async create(body: CreateSalaryDto & CreateSalaryEmployeesDto): Promise<Salary> {
        if (body.employeeIds && body.employeeIds.length && body.type === SalaryType.OVERTIME) {
            const employees = await Promise.all(body.employeeIds.map(async (employeeId) => await this.employeeService.findOne(employeeId)));
            for (let i = 0; i < employees.length; i++) {
                // get payroll để lấy thông tin
                const payroll = await this.payrollService.findFirst({
                    employeeId: employees[i].id,
                    createdAt: {
                        gte: firstMonth(body.datetime ?? new Date()),
                        lte: lastMonth(body.datetime ?? new Date()),
                    }
                });

                if (!payroll) {
                    throw new BadRequestException(`Bảng lương tháng ${new Date().getMonth()} của nhân viên ${employees[i].lastName} không tồn tại. `);
                }
                // Tạo overtime trong payroll cho nhân viên
                const salary = Object.assign(body, {payrollId: payroll.id, employeeId: employees[i].id});
                await this.repository.create({
                    employeeId: salary.employeeId,
                    title: salary.title,
                    datetime: salary.datetime,
                    forgot: salary.forgot,
                    note: salary.note,
                    payrollId: salary.payrollId,
                    type: salary.type,
                    price: salary.price,
                    rate: salary.rate,
                    times: salary.times,
                    unit: salary.unit
                });
            }
        } else {
            const payroll = await this.payrollService.findOne(body.payrollId);

            if (payroll.salaries.map(salary => salary.type).includes(SalaryType.BASIC)) {
                throw new BadRequestException(`Lương cơ bản của nhân viên ${payroll.employee.firstName + payroll.employee.lastName} đã tồn tại. Vui lòng không thêm`);
            }
            return await this.repository.create({
                title: body.title,
                datetime: new Date(body.datetime),
                forgot: body.forgot,
                note: body.note,
                payrollId: body.payrollId,
                type: body.type,
                price: body.price,
                rate: body.rate,
                times: body.times,
                unit: body.unit
            });
        }
    }

    //
    // findAll(employeeId: number, skip: number, take: number, search?: string) {
    //   return this.repository.findAll(employeeId, skip, take, search);
    // }

    findBy(employeeId: number, query: any): Promise<Salary[]> {
        throw new Error("Method not implemented.");
    }

    async findOne(id: number): Promise<OneSalary> {
        return await this.repository.findOne(id);
    }

    async update(id: number, updates: UpdateSalaryDto) {
        const salary = await this.findOne(id);

        const payroll = await this.payrollService.findOne(salary.payrollId);
        if (payroll.paidAt) {
            throw new BadRequestException("Bảng lương đã thanh toán không được phép sửa");
        }

        // Nếu lương đc update là BASIC, STAY, BASIC_INSURANCE thì sẽ tạo ra cái mới để lưu lại lịch sử lương. Những loại còn lại sẽ update
        if (salary.type === SalaryType.BASIC || salary.type === SalaryType.STAY || salary.type === SalaryType.BASIC_INSURANCE) {
            return this.create(Object.assign(salary, updates));
        }
        return await this.repository.update(id, updates);
    }

    async remove(id: number) {
        const salary = await this.findOne(id);
        if (salary.payroll.paidAt) {
            throw new BadRequestException("Bảng lương đã thanh toán không được phép xoá");
        }
        return this.repository.remove(id);
    }

    createHistory(): Promise<void> {
        return Promise.resolve(undefined);
    }
}
