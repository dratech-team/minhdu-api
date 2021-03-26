import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

export interface SendData<T> {
  statusCode: number;
  errorCode: number;
  message: string;
  data: T;
}

export class CustomException<T> implements ExceptionFilter<T> {
  catch(exception: T, host: ArgumentsHost) {}

  send(exception: T, host: ArgumentsHost, responseData: SendData<any>) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: responseData.errorCode,
      message: responseData.message,
      data: responseData.data,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
