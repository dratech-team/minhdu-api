import {Injectable} from '@nestjs/common';
import {CreateExportDto} from './dto/create-export.dto';
import {UpdateExportDto} from './dto/update-export.dto';
import {ExportTypeEnum} from "./enums/export.emum";
import {ExportConstant} from "./constants";

@Injectable()
export class ExportService {
  create(createExportDto: CreateExportDto) {
    return 'This action adds a new export';
  }

  findAll(type: ExportTypeEnum) {
    let customs: any;
    switch (type) {
      case ExportTypeEnum.PAYROLL: {
        customs = ExportConstant.payroll;
        break;
      }
      case ExportTypeEnum.TIME_SHEET: {
        customs = ExportConstant.timesheet;
        break;
      }
      case ExportTypeEnum.SEASONAL: {
        customs = ExportConstant.seasonal;
        break;
      }
      case ExportTypeEnum.OVERTIME: {
        customs = ExportConstant.overtime;
        break;
      }
      case ExportTypeEnum.BASIC: {
        customs = ExportConstant.basic;
        break;
      }
      case ExportTypeEnum.STAY: {
        customs = ExportConstant.stay;
        break;
      }
      case ExportTypeEnum.ALLOWANCE: {
        customs = ExportConstant.allowance;
        break;
      }
      case ExportTypeEnum.ABSENT: {
        customs = ExportConstant.absent;
        break;
      }
      case ExportTypeEnum.EMPLOYEES: {
        customs = ExportConstant.employee;
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
