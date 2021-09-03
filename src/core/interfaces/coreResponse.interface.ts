import {Column} from "exceljs";

export interface CoreResponse {
  status?: boolean,
  statusCode?: number,
  data?: any,
  message?: string,
  excel?: {
    name: string,
    title?: string,
    customHeaders?: Array<Partial<Column>>,
    data: any[],
  },
}
