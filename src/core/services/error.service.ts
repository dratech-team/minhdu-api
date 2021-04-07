import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { ConfigService } from "@/config/config.service";
import { MyLoggerService } from "@/services/mylogger.service";
import { ERROR_CODE } from "@/constants/error.constant";
import { USER_TYPE } from "@/constants/role-type.constant";

@Injectable()
export class ErrorService {
  protected readonly logger: MyLoggerService = new MyLoggerService(
    this.constructor.name
  );

  constructor(public readonly configService: ConfigService) {}

  public async throwErrorWrongRole(
    userType: USER_TYPE,
    userTypes: USER_TYPE[]
  ): Promise<void> {
    throw new HttpException(
      {
        message: `Bạn là ${userType}, nhưng mục này chỉ dành cho những người có quyền ${userTypes.join(
          ","
        )}`,
        statusCode: ERROR_CODE.AUTH_USER_WRONG_PASSWORD,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorWrongPassword(): Promise<void> {
    throw new HttpException(
      {
        message: "AUTH_USER_WRONG_PASSWORD",
        statusCode: ERROR_CODE.AUTH_USER_WRONG_PASSWORD,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorImageNotFound(
    imageId: ObjectId | string
  ): Promise<void> {
    throw new HttpException(
      {
        message: "Không tìm thấy hình ảnh này!",
        statusCode: ERROR_CODE.IMAGE_NOT_FOUND,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorRefreshTokenNotExist(): Promise<void> {
    throw new HttpException(
      {
        message: "REFRESH_TOKEN_NOT_EXIST",
        statusCode: ERROR_CODE.REFRESH_TOKEN_NOT_EXIST,
      },
      HttpStatus.BAD_REQUEST
    );
  }

  public async throwErrorForbiddenResource(): Promise<void> {
    throw new HttpException(
      {
        message: "Không tìm thấy tài nguyên. Vui lòng kiểm tra lại!",
        statusCode: ERROR_CODE.FORBIDDEN_RESOURCE,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
