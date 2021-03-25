export interface CoreResponse {
  status?: boolean,
  statusCode?: number,
  data?: any,
  message?: string,
  excel?: {
    name: string,
    data: Record<any, any>[],
    customHeaders?: Array<string>,
  },
}