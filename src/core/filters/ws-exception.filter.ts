import { ArgumentsHost, Catch, WsExceptionFilter } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";

@Catch(Error, WsException)
export class WebsocketsExceptionFilter implements WsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    console.log("WebsocketsExceptionFilter", exception.message);
  }
}
