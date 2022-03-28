import {Injectable} from '@nestjs/common';
import {CreateExportDto} from './dto/create-export.dto';
import {UpdateExportDto} from './dto/update-export.dto';
import {ExportTypeEnum} from "./enums/export.emum";

@Injectable()
export class ExportService {
  create(createExportDto: CreateExportDto) {
    return 'This action adds a new export';
  }

  findAll(type: ExportTypeEnum) {
    let customs: any;
    switch (type) {
      case ExportTypeEnum.PAYROLL: {
        customs = {
          name: "Họ và tên",
          position: "Chức vụ",
          basic: "Tổng Lương cơ bản",
          stay: "Tổng phụ cấp ở lại",
          overtime: "Tổng tiền tăng ca",
          deduction: "Tổng tiền khấu trừ",
          allowance: "Tổng tiền phụ cấp",
          workday: "Ngày công chuẩn",
          absent: "Vắng",
          bsc: "Quên giấy phép/BSC",
          bscSalary: "Tổng tiền quên giấy phép/BSC",
          workdayNotInHoliday: "Tổng công trừ ngày lễ",
          payslipNormalDay: "Tổng lương trừ ngày lễ",
          worksInHoliday: "Ngày Lễ đi làm",
          payslipInHoliday: "Lương lễ đi làm",
          worksNotInHoliday: "Ngày lễ không đi làm",
          payslipNotInHoliday: "Lương lễ không đi làm",
          totalWorkday: "Tổng ngày thực tế",
          payslipOutOfWorkday: "Lương ngoài giờ x2",
          tax: "Thuế",
          total: "Tổng lương",
        };
        break;
      }
      case ExportTypeEnum.TIME_SHEET: {
        customs = {
          lastName: "Họ và tên",
          branch: "Đơn vị",
          position: "Chức vụ",
        };
        break;
      }
      case ExportTypeEnum.SEASONAL: {
        customs = {
          lastName: "Họ và tên",
          branch: "Đơn vị",
          position: "Chức vụ",
          datetime: "Ngày",
          title: "Loại tăng ca",
          workdays: 'Tổng ngày làm',
          totalSalaryWorkday: "Tổng tiền",
          times: "Tổng giờ làm",
          totalSalaryTimes: "Tổng tiền",
          total: "Tổng cộng"
        };
        break;
      }
      case ExportTypeEnum.OVERTIME: {
        customs = {
          lastName: "Họ và tên",
          branch: "Đơn vị",
          position: "Chức vụ",
          datetime: "Ngày",
          title: "Loại tăng ca",
          unit: "Đơn vị tính",
          price: "Đơn giá",
          total: "Tổng tiền"
        };
        break;
      }
      case ExportTypeEnum.BASIC: {
        customs = {
          lastName: "Họ và tên",
          branch: "Đơn vị",
          position: "Chức vụ",
          datetime: "Ngày",
          title: `Loại lương cơ bản`,
          price: `Số tiền`
        };
        break;
      }
      case ExportTypeEnum.STAY: {
        customs = {
          lastName: "Họ và tên",
          branch: "Đơn vị",
          position: "Chức vụ",
          datetime: "Ngày",
          title: `Loại phụ cấp lương`,
          price: `Giá`
        };
        break;
      }
      case ExportTypeEnum.ALLOWANCE: {
        customs = {
          lastName: "Họ và tên",
          branch: "Đơn vị",
          position: "Chức vụ",
          datetime: "Ngày",
          title: `Loại phụ cấp thêm`,
          price: `Giá`
        };
        break;
      }
      case ExportTypeEnum.ABSENT: {
        customs = {
          lastName: "Họ và tên",
          branch: "Đơn vị",
          position: "Chức vụ",
          datetime: "Ngày",
          title: `Loại vắng`,
        };
        break;
      }
      case ExportTypeEnum.EMPLOYEES: {
        customs = {
          lastName: "Họ và tên",
          type: "Loại nhân viên",
          birthday: "Ngày sinh",
          gender: "Giới tính",
          createdAt: `Ngày vào làm`,
          workedAt: `Ngày chính thức`,
          isFlatSalary: `Loại lương`,
          phone: `Số điện thoại`,
          workphone: `Số điện thoại 2`,
          branch: `Đơn vị`,
          position: `Chức vụ`,
          identify: `CMND/CCCD`,
          province: `Tỉnh/Thành phố`,
          district: `Quận/Huyện`,
          ward: `Phường/Xã`,
          address: `Địa chỉ`,
        };
      }
    }
    return Object.keys(customs).map((key) => ({key: key, value: customs[key]}));
  }

  findOne(id: number) {
    return `This action returns a #${id} export`;
  }

  update(id: number, updateExportDto: UpdateExportDto) {
    return `This action updates a #${id} export`;
  }

  remove(id: number) {
    return `This action removes a #${id} export`;
  }
}
