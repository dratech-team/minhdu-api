export interface PaginateResult {
  data: any,
  statusCode: number,
  page: number,
  total: number,
  isLastPage?: boolean,
}