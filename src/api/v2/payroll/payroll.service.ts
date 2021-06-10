import {BadRequestException, ConflictException, Injectable} from '@nestjs/common';
import {UpdatePayrollDto} from './dto/update-payroll.dto';
import {DatetimeUnit, Salary, SalaryType} from '@prisma/client';
import * as moment from "moment";
import {PayrollRepository} from "./payroll.repository";
import {EmployeeService} from "../employee/employee.service";
import {SalaryService} from "../salary/salary.service";
import {CreatePayrollDto} from "./dto/create-payroll.dto";
import {firstMonth, lastDayOfMonth, lastMonth} from "../../../utils/datetime.util";
import * as XLSX from 'xlsx';

var formidable = require('formidable');

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
    const payroll = await this.repository.findMany({first, last, employeeId: body.employeeId});
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
        data: res.data,
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
      if (salary.type === SalaryType.BASIC || salary.type === SalaryType.STAY) {
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
    let staySalary = 0;
    let allowanceSalary = 0;
    let overtime = 0;
    let absentTime = 0;
    let lateTime = 0;
    let daySalary = 0;
    let total = 0;
    /*
    * Nếu tháng này nghỉ ngang thì sẽ lấy ngày hôm nay (lúc lập phiếu lương)*/
    let actualDay = (!payroll.isEdit ? new Date().getDate() : lastDayOfMonth(payroll.createdAt)) - this.totalAbsent(payroll.salaries);

    if (payroll.employee.isFlatSalary && this.totalAbsent(payroll.salaries) === 0) {
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
          if (payroll.salaries[i].times === null && payroll.salaries.datetime === null) {
            payroll.salaries[i].times = 1;
          }
          allowanceSalary += payroll.salaries[i].times * payroll.salaries[i].price;
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
      daySalary = (basicSalary + staySalary) / payroll.employee.position.workday;
    }

    const basic = payroll.salaries.filter(salary => salary.title === 'Lương cơ bản trích BH')[0];

    const tax = payroll.employee.contractAt !== null ? basic.price * 0.115 : 0;
    const deduction = daySalary / 8 * lateTime + daySalary * absentTime;
    const allowanceOvertime = daySalary * overtime;

    if (actualDay >= payroll.employee.position.workday) {
      total = ((daySalary * actualDay) + allowanceSalary + allowanceOvertime + staySalary) - tax;
    } else {
      total = ((daySalary * actualDay) + allowanceSalary + allowanceOvertime) - tax;
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
      const employees = await this.employeeService.findBy(branchId);

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

export function readFirstSheet(data: any[]) {
  var form = new formidable.IncomingForm();

}

function OBJtoXML(obj) {
  var xml = '';
  for (var prop in obj) {
    xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
    if (obj[prop] instanceof Array) {
      for (var array in obj[prop]) {
        xml += "<" + prop + ">";
        xml += OBJtoXML(new Object(obj[prop][array]));
        xml += "</" + prop + ">";
      }
    } else if (typeof obj[prop] == "object") {
      xml += OBJtoXML(new Object(obj[prop]));
    } else {
      xml += obj[prop];
    }
    xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
  }
  var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
  console.log(xml);
  return xml;
}

// export function readFirstSheet(data: any[]) {
//   const excelData = data;
//   const dataSize = excelData ? Object.keys(excelData[0]).length : 0;
//   const wb = XLSX.utils.book_new();
//   let ws;
//
//   const customHeaders = null;
//   // Append headers & data
//   if (customHeaders) {
//     ws = XLSX.utils.sheet_add_aoa(wb, [customHeaders]);
//     XLSX.utils.sheet_add_json(ws, excelData, {origin: 'A4', skipHeader: true});
//   } else {
//     ws = XLSX.utils.json_to_sheet(excelData);
//   }
//
//   // Auto filter
//   ws['!autofilter'] = {ref: `A1:${getExcelColumn(dataSize)}1`};
//   prep(data[0].salaries);
//   autoFitColumns(data, ws, customHeaders);
//   XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
//   XLSX.writeFile(wb, 'b.xlsx', {type: 'file', bookType: 'xlsx'});
// }
//   console.log(data);
// }
//
// // This function can be bad performance if the excel data is big
// function autoFitColumns(json: any[], worksheet: any, header?: string[]): void {
//   const jsonKeys = header ? header : Object.keys(json);
//   const objectMaxLength = [];
//
//   for (let i = 0; i < json.length; i++) {
//     const value = json[i];
//     for (let j = 0; j < jsonKeys.length; j++) {
//       if (typeof value[jsonKeys[j]] == 'number') {
//         objectMaxLength[j] = 10;
//
//       } else {
//         const l = value[jsonKeys[j]] ? value[jsonKeys[j]].length : 0;
//         objectMaxLength[j] = objectMaxLength[j] >= l ? objectMaxLength[j] : l;
//       }
//     }
//
//     const key = jsonKeys;
//     for (let j = 0; j < key.length; j++) {
//       objectMaxLength[j] = objectMaxLength[j] >= key[j].length ? objectMaxLength[j] : key[j].length;
//     }
//   }
//
//   worksheet['!cols'] = objectMaxLength.map(w => {
//     return {width: w + 5};
//   });
// }
