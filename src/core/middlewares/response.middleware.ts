import { Injectable, NestMiddleware } from "@nestjs/common";

@Injectable()
export class ResponseMiddleware implements NestMiddleware {
  use(req: Record<string, any>, res: any, next: () => void): any {
    res.sendItems = function(items, total = 0, skip = 0, limit = 0) {
      res.send({
        skip: parseInt(req.query.skip || 0),
        limit: parseInt(req.query.limit || 20),
        total: total,
        items: items
      });
    };
    next();
  }
}
