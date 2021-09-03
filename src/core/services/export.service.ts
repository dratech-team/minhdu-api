import {Injectable} from "@nestjs/common";
import {optionalRequire} from "@nestjs/core/helpers/optional-require";
import {Response} from "express";
import {CoreResponse} from "../interfaces/coreResponse.interface";
import * as ExcelJS from 'exceljs';
import {Style} from "exceljs";

const moment = optionalRequire("moment");

@Injectable()
export class ExportService {

    toExcel(
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

        worksheet.columns = result.excel.customHeaders.map((data) => {
            return Object.assign(
                data,
                {
                    width: data.header.length + 5,
                    style: {
                        shrinkToFit: true,
                        alignment: {horizontal: 'center'},
                        wrapText: true,
                    } as Partial<Style>
                }
            );
        });

        console.log(worksheet.columns)
        result.excel.data.map((data) => {
            worksheet.addRow(data);
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


    // toExcel(
    //   response: Response,
    //   result: CoreResponse,
    //   respStatusCode: number
    // ): any {
    //   /*
    //   * title: Tiêu đề của sheet
    //   * header: tiêu đề của table
    //   * data: Dữ liệu dạng json được truyền vào
    //   * */

    //   /*
    //  * Get data đc truyền vào dưới dạng json
    //  */
    //   const excelData = result.excel.data;

    //   const workbook = new ExcelJS.Workbook();

    //   /*
    //   * Data size của mỗi ô đc tính theo length của header
    //   */
    //   const dataSize = excelData ? Object.keys(excelData[0]).length : 0;

    //   const wb = XLSX.utils.book_new();
    //   let ws: WorkSheet;

    //   /*
    //   * Gộp các ô thành tiêu đề của sheet
    //   * s: start
    //   * r: row
    //   * c: column
    //   * e: end
    //   */

    //   if (result.excel.customHeaders) {

    //     ///TODO: Thêm tiêu đề từ col 1 - 10 của row 1
    //     // ws = XLSX.utils.cell_add_comment(wb, ws, "asdasd");

    //     ws["!merges"] = [
    //       {s: {r: 1, c: 0}, e: {r: 1, c: 10}}
    //     ];

    //     /*
    //      * Append headers & data
    //      */
    //     ws = XLSX.utils.sheet_add_aoa(wb, [result.excel.customHeaders], {origin: "A5"});
    //     XLSX.utils.sheet_add_json(ws, excelData, {
    //       origin: "A6",
    //       skipHeader: true,
    //     });
    //   } else {
    //     ws = XLSX.utils.json_to_sheet(excelData);
    //   }

    //   // Auto filter
    //   ws["!autofilter"] = {
    //     ref: `A1:${ExportService.getExcelColumn(dataSize)}1`,
    //   };
    //   // Auto fit
    //   ExportService.autoFitColumns(excelData, ws, result.excel.customHeaders);

    //   // Append data to sheet
    //   XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

    //   /* generate buffer */
    //   const buf = XLSX.writeFile(wb, result.excel.name, {type: "file", bookType: "xlsx"});
    //   response.header(
    //     "Content-Disposition",
    //     `attachment; filename=${result.excel.name} (${moment().format(
    //       "DD-MM-YYYY"
    //     )}).xlsx`
    //   );
    //   response.header(
    //     "Content-Type",
    //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    //   );
    //   response.status(respStatusCode).send(buf);
    // }

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
                if (typeof value[jsonKeys[j]] == "number") {
                    objectMaxLength[j] = 10;
                } else {
                    const l = value[jsonKeys[j]] ? value[jsonKeys[j]].length : 0;
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
