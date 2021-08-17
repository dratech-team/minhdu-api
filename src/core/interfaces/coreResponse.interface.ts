export interface CoreResponse {
  status?: boolean,
  statusCode?: number,
  data?: any,
  message?: string,
  excel?: {
    title?: string,
    name: string,
    customHeaders?: Array<string>,
    data: any[],
  },
}
