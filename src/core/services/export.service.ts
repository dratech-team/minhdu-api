import {Response} from "express";
import {InputExcel} from "../interfaces/coreResponse.interface";
import * as ExcelJS from "exceljs";
import * as moment from "moment";

export async function exportExcel(
  response: Response,
  result: InputExcel,
  respStatusCode: number
) {
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
  const end = alphabet[result.customHeaders.length - 1];
  worksheet.mergeCells("A1", end + 2);
  worksheet.getCell("C1").value = result.title;

  // alignment
  worksheet.getCell("C1").style.alignment = {
    horizontal: "center",
    vertical: "middle",
  };
  // font
  worksheet.getCell("C1").style.font = {
    bold: true,
    size: 18,
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

  // fill
  worksheet.getRow(4).eachCell((cell, _) => {
    if (cell.value) {
      cell.fill = fill;
    }
  });

  worksheet.columns = autoFitColumnsHeader(result);

  result.data.map((e) => {
    worksheet.addRow(e);
  });

  worksheet.eachRow((row, _) => {
    row.eachCell((cell, colNumber) => {
      if (cell.value) row.getCell(colNumber).border = borders;
    });
  });

  const buf = await workbook.xlsx.writeBuffer();

  response.setHeader(
    "Content-Disposition",
    `${result.name} (${JSON.stringify(moment(new Date()).format(
      "DD-MM-YYYY"
    )) }).xlsx`
  );

  response.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  response.setHeader("Access-Control-Expose-Headers", "*");

  return response.status(respStatusCode).send(buf);
}

function autoFitColumnsHeader(input: InputExcel) {
  const jsonKeys = input.customKeys;
  const objectMaxLength = [];
  const numFmt = [];

  for (let i = 0; i < input.data.length; i++) {
    const value = input.data[i];

    for (let j = 0; j < jsonKeys.length; j++) {
      const l = value[jsonKeys[j]]?.length ?? 0;
      objectMaxLength[j] = objectMaxLength[j] >= l ? objectMaxLength[j] : l;

      if (typeof value[jsonKeys[j]]?.getMonth === "function") {
        numFmt[j] = "dd/mm/yy";
      }
      if (typeof value[jsonKeys[j]] === 'number') {
        numFmt[j] = "#,##0.00";
        console.log(numFmt[j]);
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

const fill: ExcelJS.Fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: {argb: "bfbfbf"},
  bgColor: {argb: "FF0000FF"},
};

const borders: Partial<ExcelJS.Borders> = {
  top: {style: "thin"},
  left: {style: "thin"},
  bottom: {style: "thin"},
  right: {style: "thin"},
};

const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
