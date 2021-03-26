import { ApiProperty } from "@nestjs/swagger";
import { ERROR_CODE } from "@/constants/error.constant";

export class ErrorResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({
    enum: ERROR_CODE,
  })
  statusCode: ERROR_CODE;
}

export class TokenExpiredErrorResponseDto extends ErrorResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({
    example: ERROR_CODE.TOKEN_EXPIRED,
  })
  statusCode: number;
}

export class InvalidTokenErrorResponseDto extends ErrorResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({
    example: ERROR_CODE.INVALID_TOKEN,
  })
  statusCode: number;
}

export class ForbiddenErrorResponseDto extends ErrorResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({
    example: ERROR_CODE.FORBIDDEN,
  })
  statusCode: number;
}
