import {ArgumentsHost, Catch, HttpException} from "@nestjs/common";
import {CustomException, SendData} from "./custom-exception";
import {IError} from "../interfaces/error.interface";
// import { IError } from "@/core/interfaces/error.interface";
// import { CustomException, SendData } from "@/core/filters/custom-exception";

@Catch(HttpException)
export class HttpExceptionFilter extends CustomException<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const errorCode = exception.getStatus();
    const response = exception.getResponse();

    const message = response['message'] ?? "Lỗi không xác định. Vui lòng nhấn 'Gửi' để gửi báo cáo đến nhà phát triển. Xin cảm ơn.";
    const statusCode = response['statusCode'];
    // const data = response.data;

    console.log("[HTTP-EXCEPTION]", response);
    this.send(exception, host, {
      statusCode,
      errorCode,
      message
    } as SendData<any>);
  }
}
