export interface CorePaginateResult<T> {
  total?: number;
  statusCode?: number;
  isLastPage?: boolean;
  data: T[];
}
