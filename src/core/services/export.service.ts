import {Injectable} from "@nestjs/common";
import {optionalRequire} from "@nestjs/core/helpers/optional-require";
import {Response} from "express";
import {InputExcel} from "../interfaces/coreResponse.interface";
import * as ExcelJS from "exceljs";

const moment = optionalRequire("moment");

@Injectable()
export class ExportService {
  toExcel(response: Response, result: InputExcel, respStatusCode: number): any {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Me";
    workbook.lastModifiedBy = "Her";
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();

    const worksheet = workbook.addWorksheet(result.title);

    /*
    * Header
    * */
    worksheet.mergeCells("A1", "J2");
    worksheet.getCell("C1").value = result.title;

    // alignment
    worksheet.getCell("C1").style.alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    // font
    worksheet.getCell("C1").style.font = {
      bold: true,
      size: 24,
    };

    /*
    * Title
    * */
    worksheet.getRow(4).values = result.customHeaders;

    // font
    worksheet.getRow(4).font = {
      bold: true,
      outline: true,
    };

    // alignment
    worksheet.getRow(4).alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    // alignment
    // for (let i = 0; i < result.customHeaders.length; i++) {
    //   worksheet.getCell(alphabet[i] + i).style.fill = {
    //     type: 'pattern',
    //     pattern: 'darkGray',
    //     fgColor: {argb: 'FFFFFF00'},
    //     bgColor: {argb: 'FF0000FF'}
    //   };
    // }

    worksheet.columns = this.autoFitColumnsHeader(result);

    result.data.map((e) => {
      console.log(alphabet);
      worksheet.addRow(e);
    });

    const buf = workbook.xlsx.writeFile(result.name);

    response.header(
      "Content-Disposition",
      `attachment; filename=${result.name} (${moment().format(
        "DD-MM-YYYY"
      )}).xlsx`
    );
    response.header(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    response.status(respStatusCode).send(buf);
  }

  private autoFitColumnsHeader(input: InputExcel) {
    const jsonKeys = input.customKeys;
    const objectMaxLength = [];
    const numFmt = [];

    for (let i = 0; i < input.data.length; i++) {
      const value = input.data[i];

      for (let j = 0; j < jsonKeys.length; j++) {
        const l = value[jsonKeys[j]]?.length ?? 0;
        objectMaxLength[j] = objectMaxLength[j] >= l ? objectMaxLength[j] : l;

        if (typeof value[jsonKeys[j]].getMonth === "function") {
          numFmt[j] = "dd/mm/yyyy";
        }
      }

      const key = input.customHeaders;
      for (let j = 0; j < key.length; j++) {
        objectMaxLength[j] = Math.max(...[+objectMaxLength[j], +key[j].length]);
      }
    }

    return input.customHeaders.map((e, i: number) => {
      return {
        key: input.customKeys[i],
        numFmt: numFmt[i],
        width: objectMaxLength[i] + 5,
      } as Partial<ExcelJS.Style>;
    });
  }
}

const alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split(", ");
