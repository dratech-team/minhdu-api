import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    Logger,
    HttpException,
    HttpStatus,
    BadRequestException,
    ForbiddenException
  } from '@nestjs/common';
  
  @Catch()
  export class HttpErrorFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
      console.log(exception.stack);


      const status = exception.getStatus
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
        const timestamp = new Date().toLocaleDateString();

        if (exception instanceof BadRequestException) {
            const statusCode = HttpStatus.BAD_REQUEST;
            response.status(statusCode).json({
                status: false,
                statusCode: statusCode,
                timestamp,
                message: exception['response']['message']
            });
        } else if (['CastError', 'ValidationError'].includes(exception.constructor.name)) {
            const statusCode = HttpStatus.BAD_REQUEST;
            response.status(statusCode).json({
                timestamp,
                status: false,
                statusCode: statusCode,
                message: exception['message'].split('.,').map(msg => msg.split(':').slice(-1)[0].replace(/(`|Path)/g, '').trim()),
            });
        } else if (exception instanceof ForbiddenException) {
            const statusCode = HttpStatus.FORBIDDEN;
            response.status(statusCode).json({
                timestamp,
                status: false,
                code: status,
                statusCode: statusCode,
                message: 'Permission denied!'
            });
        } else if (exception instanceof HttpException) {
            const statusCode = exception.getStatus();
            response.status(statusCode).json(exception.getResponse());
        }

      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        Logger.error(
          `${request.method} ${request.url}`,
          exception.stack,
          'ExceptionFilter',
        );
      } else {
        Logger.error(
          `${request.method} ${request.url}`,
          JSON.stringify(response),
          'ExceptionFilter',
        );
      }
  
      response.status(status).json(response);
    }
  }
  