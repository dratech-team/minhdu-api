import {Injectable} from "@nestjs/common";
import {optionalRequire} from "@nestjs/core/helpers/optional-require";
import {Response} from "express";
import {CoreResponse} from "../interfaces/coreResponse.interface";

const moment = optionalRequire("moment");
const XLSX = require("xlsx");

@Injectable()
export class ExportService {
  toExcel(
    response: Response,
    result: CoreResponse,
    respStatusCode: number
  ): any {
    const excelData =
      typeof result.excel.data["docs"] !== "undefined" &&
      typeof result.excel.data["hasNextPage"] !== "undefined" &&
      typeof result.excel.data["hasPrevPage"] !== "undefined"
        ? result.excel.data["docs"]
        : result.excel.data;
    const dataSize = excelData ? Object.keys(excelData[0]).length : 0;
    const wb = XLSX.utils.book_new();
    let ws;
    let title;
    // Append headers & data & title
    if (result.excel.customHeaders) {
      ws = XLSX.utils.sheet_add_aoa(wb, [[result.excel.title],[[]], result.excel.customHeaders], {origin: "A2"});
      XLSX.utils.sheet_add_json(ws, excelData, {
        origin: "A5",
        skipHeader: true,
      });
    } else {
      ws = XLSX.utils.sheet_add_aoa(wb, [[result.excel.title]],[[]], {origin: "A2"});
        XLSX.utils.json_to_sheet(excelData, {
        origin: 'A3',
        skipHeader: true,
      });
    }
    /// styling title
    ws['!merges'] = [{s:{r:1, c:0}, e:{ r:2 , c: dataSize -1} } ];
    ws["A2"].s = {
      font: {
        sz: 24,
        bold: true,
        color: { rgb: "FFFFAA00" },
      },
    };
    // Auto filter
    ws["!autofilter"] = {
      ref: `A1:${ExportService.getExcelColumn(dataSize)}1`,
    };
    // Auto fit
    ExportService.autoFitColumns(excelData, ws, result.excel.customHeaders);

    // Append data to sheet
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

    /* generate buffer */
    const buf = XLSX.writeFile(wb, result.excel.name, {type: "file", bookType: "xlsx"});
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

  // This function can be bad performance if the excel data is big
  private static autoFitColumns(
    json: any[],
    worksheet: any,
    header?: string[]
  ): void {
    const jsonKeys = header ? header : Object.keys(json[0]);
    const objectMaxLength = [];
    for (let i = 0; i < json.length; i++) {
      const value = json[i];
      for (let j = 0; j < jsonKeys.length; j++) {
        if (typeof value.jsonKeys[j] == "number") {

          objectMaxLength[j] = 15;
        } else {
          const l =  value.jsonKeys[j] ? value.jsonKeys[j].length : 0;
          objectMaxLength[j] = objectMaxLength[j] >= l ? objectMaxLength[j] : l;
        }
      }

      const key = jsonKeys;
      for (let j = 0; j < key.length; j++) {
        objectMaxLength[j] =
          objectMaxLength[j] >= key[j].length
            ? objectMaxLength[j]
            : key[j].length;
      }
    }

    worksheet["!cols"] = objectMaxLength.map((w) => {
      return {width: w};
    });
  }

  private static getExcelColumn(index: number): string {
    let colName = "",
      dividend = Math.floor(Math.abs(index)),
      rest;

    while (dividend > 0) {
      rest = (dividend - 1) % 26;
      colName = String.fromCharCode(65 + rest) + colName;
      dividend = parseInt(String((dividend - rest) / 26));
    }
    return colName;
  }
}
