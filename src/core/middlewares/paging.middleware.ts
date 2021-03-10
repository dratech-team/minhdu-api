import { Injectable, NestMiddleware } from "@nestjs/common";
import { PagingEnum } from "../constants/paging.enum";

@Injectable()
export class PagingMiddleware implements NestMiddleware {
  use(req: Record<string, any>, res: Response, next: () => void): any {
    req.query.page = +req.query.page || PagingEnum.DEFAULT_PAGE;
    req.query.limit = +req.query.limit || PagingEnum.DEFAULT_LIMIT;
    req.query.sort = this.buildSortStringToObject(req.query.sort);
    if (req.query.limit > PagingEnum.DEFAULT_MAX_LIMIT) {
      req.query.limit = 100;
    }
    next();
  }

  /**
   * goal function: accept string sort and build to object sort in mongodb
   * @sortString {string} string sort: "-created_at,name,-age"
   * @return {object} object sort: {created_at: -1, name: 1, age: -1}
   */
  buildSortStringToObject(sortString: string = ""): object {
    const sort = {};

    if (!sortString) return sort;

    sortString.split(",").forEach(field => {
      const typeSort = field.charAt(0);
      if (typeSort !== "-") {
        sort[field] = 1;
      } else {
        const fieldSort = field.substring(1);
        sort[fieldSort] = -1;
      }
    });
    return sort;
  }
}
