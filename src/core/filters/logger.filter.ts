import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import {PrismaService} from "../../prisma.service";

@Catch(HttpException)
export class LoggerFilter implements ExceptionFilter {
  constructor(public readonly prisma: PrismaService) {
  }
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    console.log(response.statusCode);
    console.log(status);
    response
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
