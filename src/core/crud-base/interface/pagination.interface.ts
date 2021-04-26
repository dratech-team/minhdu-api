import {QueryPopulateOptions} from "mongoose";

export interface PaginatorOptions {
  select?: Object | string;
  sort?: Object | string;
  populate?:
    | Array<Object>
    | Array<string>
    | Object
    | string
    | QueryPopulateOptions;
  lean?: boolean;
  leanWithId?: boolean;
  offset?: number;
  page?: number;
  limit?: number;
}


