export interface CorePaginateResult {
  total?: number;
  statusCode?: number;
  isLastPage?: boolean;
  data: any;
}
