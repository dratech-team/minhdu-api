import {Injectable} from "@nestjs/common";
import {optionalRequire} from "@nestjs/core/helpers/optional-require";
import {Response} from "express";
import {CoreResponse} from "../interfaces/coreResponse.interface";
import * as ExcelJS from 'exceljs';
import {Column, Style, Worksheet} from 'exceljs';

const moment = optionalRequire("moment");

@Injectable()
export class ExportService {

  toExcel<T>(
    response: Response,
    result: CoreResponse,
    respStatusCode: number
  ): any {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Me';
    workbook.lastModifiedBy = 'Her';
    workbook.created = new Date(1985, 8, 30);
    workbook.modified = new Date();
    workbook.lastPrinted = new Date(2016, 9, 27);

    const worksheet = workbook.addWorksheet(result.excel.title);

    const header = this.autoFitColumnsHeader<T>(result.excel.data, worksheet, result.excel.customHeaders).map((data) => {
      return Object.assign(
        data,
        {
          style: {
            alignment: {horizontal: 'center'},
          }
        }
      );
    });

    // @ts-ignore
    // worksheet.setColumnKey("A5", header);
    worksheet.setColumnKey("A5", {header: header});
    result.excel.data.map((data) => {
      worksheet.insertRow(5, data);
    });

    const buf = workbook.xlsx.writeFile(result.excel.name);

    response.header(
      "Content-Disposition",
      `attachment; filename=${result.excel.name} (${moment().format(
        "DD-MM-YYYY"
      )}).xlsx`
    );
    response.header(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    response.status(respStatusCode).send(buf);
  }

  private autoFitColumnsHeader<T>(
    json: T[],
    worksheet: Worksheet,
    header?: Array<Partial<Column>>
  ) {
    const jsonKeys = header.map(e => e.key);
    const objectMaxLength = [];

    for (let i = 0; i < json.length; i++) {
      const value = json[i];

      for (let j = 0; j < jsonKeys.length; j++) {
        const l = value[jsonKeys[j]]?.length ?? 0;
        objectMaxLength[j] = objectMaxLength[j] >= l ? objectMaxLength[j] : l;
      }

      const key = header.map(e => e.header);
      for (let j = 0; j < key.length; j++) {
        objectMaxLength[j] =
          objectMaxLength[j] >= key[j].length
            ? objectMaxLength[j]
            : key[j].length;
      }
    }
    return header.map((e, i) => (Object.assign(e, {width: objectMaxLength[i] + 5})));
  }
}
