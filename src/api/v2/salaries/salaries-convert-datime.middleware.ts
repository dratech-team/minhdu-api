import {Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Request, Response} from "express";
import * as moment from "moment";

// Convert datetime
@Injectable()
export class SalariesConvertDatetimeMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.body?.startedAt) {
      req.body.startedAt = new Date(moment(req.body?.startedAt).set({
        hours: 0,
        minutes: 0,
        seconds: 0
      }).format('YYYY-MM-DD'));
    }

    if (req.body?.endedAt) {
      req.body.endedAt = new Date(moment(req.body?.endedAt).set({
        hours: 0,
        minutes: 0,
        seconds: 0
      }).format('YYYY-MM-DD'));
    }
  }
}
