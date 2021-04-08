import { ArgumentsHost, Catch, HttpException } from "@nestjs/common";
import { IError } from "@/core/interfaces/error.interface";
import { CustomException, SendData } from "@/core/filters/custom-exception";

@Catch(HttpException)
export class HttpExceptionFilter extends CustomException<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const errorCode = exception.getStatus();
    const response = exception.getResponse() as IError<any>;

    const message = response.message || "";
    const statusCode = response.statusCode || 500;
    const data = response.data;

    console.log("[HTTP-EXCEPTION]", errorCode, statusCode, message);
    this.send(exception, host, {
      statusCode,
      errorCode: statusCode,
      message,
      data,
    } as SendData<any>);
  }
}
