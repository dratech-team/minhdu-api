import { Column } from "exceljs";

export interface InputExcel{
  name: string;
  title?: string;
  customHeaders?: Array<string>;
  customKeys?: Array<string>;
  data: any[];
}
