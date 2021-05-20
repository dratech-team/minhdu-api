import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import {CreateEmployeeDto} from './dto/create-employee.dto';
import {UpdateEmployeeDto} from './dto/update-employee.dto';
import {PrismaService} from "../../../prisma.service";
import {SalaryService} from "../salary/salary.service";
import {CreateSalaryDto} from "../salary/dto/create-salary.dto";
import {UpdateSalaryDto} from "./dto/update-salary.dto";
import {SalaryType} from '@prisma/client';
import {PayrollService} from "../payroll/payroll.service";

const qr = require("qrcode");

@Injectable()
export class EmployeeService {
  selectEmployee = {
    id: true,
    name: true,
    position: {
      select: {
        id: true,
        name: true,
      }
    },
    department: {
      select: {
        id: true,
        name: true
      }
    },
    payrolls: {
      select: {
        id: true,
        paidAt: true,
        salaries: true,
      }
    },
    isFlatSalary: true,
  }

  constructor(
    private readonly prisma: PrismaService,
    private readonly salaryService: SalaryService,
    private readonly payrollService: PayrollService,
  ) {
  }

  /**
   * Thêm thông tin nhân viên và lương căn bản ban đầu
   * */
  async create(body: CreateEmployeeDto) {
    try {
      const salary = await this.salaryService.create({
        title: 'Lương cơ bản trích BH',
        price: body.price,
        type: SalaryType.BASIC,
        note: body.note
      });

      const employee = await this.prisma.employee.create({
        data: {
          id: await this.generateEmployeeCode(body),
          name: body.name,
          address: body.address,
          salaries: {
            connect: {id: salary.id}
          },
          workedAt: new Date(body.workedAt).toISOString(),
          branch: {connect: {id: body.branchId}},
          department: {connect: {id: body.departmentId}},
          position: {connect: {id: body.positionId}},
          phone: body.phone,
          birthday: new Date(body.birthday).toISOString(),
          gender: body.gender,
          note: body.note,
        },
        select: {id: true, name: true, position: true, payrolls: true}
      });

      this.payrollService.connectSalaryToPayroll(salary.id, employee.id).then();

      return {
        id: employee.id,
        name: employee.name,
        position: employee.position.name,
      };
    } catch (e) {
      console.log(e);
      if (e?.code == "P2025") {
        throw new NotFoundException(`Không tìm thấy id ${body?.branchId} hoặc ${body?.departmentId} hoặc ${body?.positionId}. Chi tiết: ${e?.meta?.cause}`);
      } else if (e?.code == "P2002") {
        throw new ConflictException(`CMND không được giống nhau. Vui lòng kiểm tra lại. Chi tiết: ${e}`);
      } else if (e?.code == "P2014") {
        throw new BadRequestException(`Chi nhánh ${body.branchId} không tồn tại phòng ban ${body.departmentId} hoặc phòng ban ${body.departmentId} không tồn tại chức vụ ${body.positionId}. Vui lòng kiểm tra lại. Chi tiết: ${e?.meta}`);
      } else {
        throw new BadRequestException(e);
      }
    }

  }

  /**
   * Thêm lương cơ bản / lương phụ cấp ở lại của nhân viên
   * */
  async createSalary(id: string, body: CreateSalaryDto) {
    try {
      const salary = await this.salaryService.create(body);
      return await this.prisma.employee.update({
        where: {id: id},
        data: {salaries: {connect: {id: salary.id}}},
      });
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Update luongw caur nhaan viene chi Hr moi dc update
   * */
  async updateSalary(id: number, updates: UpdateSalaryDto) {
    return this.salaryService.update(id, updates);
  }

  async findAll(skip: number, take: number, search?: string): Promise<any> {
    let data = [];
    let workDay: number;
    let actualDay: number = new Date().getDate();

    if (isNaN(skip) || isNaN(take)) {
      skip = 0;
      take = 10;
    }
    try {
      const total = await this.prisma.employee.count();
      const employees = await this.findEmployees(skip, take, search);

      for (let i = 0; i < employees.length; i++) {
        workDay = (await this.workDay(employees[i].department.id, employees[i].position.id)).workday;

        const payrolls = employees[i]?.payrolls?.filter(payroll => payroll.paidAt === null);

        if (payrolls?.length === 1) {
          actualDay = this.actualDay(payrolls[0]);
        }

        data.push({
          id: employees[i].id,
          name: employees[i].name,
          gender: employees[i].gender,
          birthday: employees[i].birthday,
          phone: employees[i].phone,
          workedAt: employees[i].workedAt,
          leftAt: employees[i].leftAt,
          idCardAt: employees[i].idCardAt,
          address: employees[i].address,
          certificate: employees[i].certificate,
          stayedAt: employees[i].stayedAt,
          contractAt: employees[i].contractAt,
          note: employees[i].note,
          qrcode: employees[i].qrCode,
          isFlatSalary: employees[i].isFlatSalary,
          branch: employees[i].branch,
          department: employees[i].department,
          position: employees[i].position,
          payrolls: employees[i].payrolls,
          workDay: workDay,
          actualDay
        });
      }

      return {
        total,
        data
      };
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(`Các tham số skip, take, id là bắt buộc. Vui lòng kiểm tra lại bạn đã truyền đủ 3 tham số chưa.?. Chi tiết: ${e}`);
    }
  }

  async findOne(id: string) {
    let actualDay: number = new Date().getDate();

    const employee = await this.prisma.employee.findUnique({
      where: {id: id},
      include: {
        branch: true,
        department: true,
        position: true,
        payrolls: true,
      }
    });

    const workDay = await this.workDay(employee.department.id, employee.position.id);

    const payrolls = employee?.payrolls?.filter(payroll => payroll.paidAt === null);

    if (payrolls.length === 1) {
      actualDay = this.actualDay(payrolls[0]);
    }

    return {
      id: employee.id,
      name: employee.name,
      gender: employee.gender,
      birthday: employee.birthday,
      phone: employee.phone,
      workedAt: employee.workedAt,
      leftAt: employee.leftAt,
      idCardAt: employee.idCardAt,
      address: employee.address,
      certificate: employee.certificate,
      stayedAt: employee.stayedAt,
      contractAt: employee.contractAt,
      note: employee.note,
      qrcode: employee.qrCode,
      isFlatSalary: employee.isFlatSalary,
      branch: employee.branch,
      department: employee.department,
      position: employee.position,
      payrolls: employee.payrolls,
      workDay: workDay.workday,
      actualDay
    };
  }

  async update(id: string, updates: UpdateEmployeeDto) {
    return await this.prisma.branch.update({where: {id: id}, data: updates})
      .catch((e) => new BadRequestException(e));

  }

  async remove(id: string) {
    await this.prisma.branch.delete({where: {id: id}}).catch((e) => {
      throw new BadRequestException(e);
    });
  }

  async generateEmployeeCode(body: CreateEmployeeDto): Promise<string> {
    const count = await this.prisma.employee.count();
    let gen: string;
    if (count < 10) {
      gen = "000";
    } else if (count < 100) {
      gen = "00";
    } else if (count < 1000) {
      gen = "0";
    }
    const id = `${body.branchId}${gen}${count + 1}`;
    this.updateQrCodeEmployee(id).then();
    return id;
  }

  async updateQrCodeEmployee(id: string) {
    const qrCode = await qr.toDataURL(id);
    await this.prisma.employee.update({
      where: {id: id},
      data: {qrCode: qrCode}
    });

  }

  async findEmployees(skip: number, take: number, search: string): Promise<any> {
    const include = {
      branch: {
        select: {
          id: true,
          name: true,
        }
      },
      department: {
        select: {
          id: true,
          name: true,
        }
      },
      position: {
        select: {
          id: true,
          name: true,
        }
      },
      payrolls: true
    };

    const searchName = {name: {startsWith: search}};

    if (search == '' || search === undefined || search === null) {
      return await this.prisma.employee.findMany({skip, take, include: include});
    } else {
      let employees = await this.prisma.employee.findMany({
        skip,
        take,
        where: searchName,
        include: include,
      });

      if (employees.length === 0) {
        employees = await this.prisma.employee.findMany({
          skip,
          take,
          where: {branch: searchName},
          include: include
        });
      }

      if (employees.length === 0) {
        employees = await this.prisma.employee.findMany({
          skip,
          take,
          where: {department: searchName},
          include: include
        });
      }
      return employees;
    }

  }

  async findEmployee(skip: number, take: number, search?: string) {
    return await this.prisma.employee.findMany({
      skip: skip,
      take: take,
      where: {
        name: {startsWith: search}
      },
      select: this.selectEmployee
    });
  }

  async workDay(departmentId, positionId): Promise<{ workday: number }> {
    return await this.prisma.departmentToPosition.findUnique({
      where: {
        departmentId_positionId: {
          departmentId: departmentId,
          positionId: positionId,
        }
      },
      select: {workday: true}
    });
  }

  actualDay(payroll) {
    let actualDay: number = new Date().getDate();

    const absent = payroll?.salaries?.filter(salary => salary.type === SalaryType.ABSENT).map(e => e.times).reduce((a, b) => a + b, 0);
    const late = payroll?.salaries?.filter(salary => salary.type === SalaryType.LATE).map(e => e.times).reduce((a, b) => a + b, 0);

    if (absent > 0) {
      actualDay -= absent;
    }
    if (late > 8) {
      actualDay -= 1;
    }
    return actualDay;
  }
}
