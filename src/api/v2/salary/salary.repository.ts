import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../../../prisma.service";
import {CreateSalaryDto} from "./dto/create-salary.dto";
import {UpdateSalaryDto} from "./dto/update-salary.dto";
import {OneSalary} from "./entities/salary.entity";

@Injectable()
export class SalaryRepository {
    constructor(private readonly prisma: PrismaService) {
    }

    async create(body: CreateSalaryDto) {
        console.log(body)
        try {
            return await this.prisma.salary.create({data: body});
        } catch (err) {
            console.error(err);
            throw new BadRequestException("Thất bại", err);
        }
    }

    async disConnectToPayroll(id: number) {
        try {
            return this.prisma.salary.update({
                where: {id},
                data: {
                    payroll: {
                        disconnect: true
                    }
                }
            });
        } catch (err) {
            console.error(err);
            throw new BadRequestException(err);
        }
    }

    // /*Tìm lịch sử lương của nhân viên bất kỳ*/
    // async findAll(
    //   employeeId: number,
    //   skip: number,
    //   take: number,
    //   search?: string
    // ): Promise<ResponsePagination<Salary>> {
    //   const [total, data] = await Promise.all([
    //     this.count(employeeId),
    //     this.prisma.salary.findMany({
    //       where: {employeeId},
    //     }),
    //   ]);
    //
    //   return {total, data};
    // }

    async findBy(query: any): Promise<any> {
        try {
            return this.prisma.salary.findFirst({where: {}});
        } catch (err) {
            console.error(err);
            throw new BadRequestException(err);
        }
    }

    async findMany(body: CreateSalaryDto) {
        return await this.prisma.salary.findFirst({where: body});
    }

    async findOne(id: number): Promise<OneSalary> {
        try {
            return await this.prisma.salary.findUnique({
                where: {id},
                include: {payroll: true}
            });
        } catch (err) {
            console.error(err);
            throw new NotFoundException(err);
        }
    }

    async update(id: number, updates: UpdateSalaryDto) {
        try {
            return await this.prisma.salary.update({
                where: {id: id},
                data: updates,
            });
        } catch (err) {
            console.error(err);
            throw new BadRequestException(err);
        }
    }

    async remove(id: number) {
        try {
            return await this.prisma.salary.delete({where: {id: id}});
        } catch (err) {
            console.error(err);
            throw new BadRequestException(err);
        }
    }
}
