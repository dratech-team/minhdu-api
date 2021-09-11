import { CustomException, SendData } from "./custom-exception";
import { ArgumentsHost, Catch } from "@nestjs/common";
import { MongoError } from "mongodb";

@Catch()
export class AllExceptionFilter extends CustomException<MongoError> {
  catch(exception: any, host: ArgumentsHost) {
    console.error("[AllExceptionFilter]", exception);
    const statusCode =
      exception && exception.getStatus ? exception.getStatus() : 500;

    const errmsg = exception.message;
    const isExists = errmsg && errmsg.statusCode;
    const message = isExists ? errmsg.message : errmsg;
    const errorCode = isExists ? errmsg.statusCode : statusCode;
    if (exception.constructor.name !== "HttpException") {
      // console.error('AllExceptionFilter', exception)
    }
    const data = {
      statusCode: isExists ? errmsg.statusCode : statusCode,
      errorCode,
      message,
    } as SendData<any>;
    this.send(exception, host, data);
  }
}
