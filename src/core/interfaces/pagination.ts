export interface CorePaginateResult {
  status?: boolean;
  statusCode: number;
  data?: {
    list: any;
    total: number;
    pages: number;
    hasNextPage: boolean;
  } | null;
  message: string;
}
