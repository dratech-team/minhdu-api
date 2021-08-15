export interface CoreResponse {
  status?: boolean,
  statusCode?: number,
  data?: any,
  message?: string,
  excel?: {
    name: string,
    data: any[],
    customHeaders?: Array<string>,
  },
}
