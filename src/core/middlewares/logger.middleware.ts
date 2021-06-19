import {Injectable, NestMiddleware} from "@nestjs/common";
import {Request, Response, NextFunction} from "express";
import {PrismaService} from "../../prisma.service";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {
  }

  use(req: Request, res: Response, next: NextFunction) {
    console.log(req.originalUrl);
    console.log(req.params);
    return next();
  }
}
