import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Response } from "express";
import { isIn } from "class-validator";
import { CoreResponse } from "@/interfaces/coreResponse.interface";
import { CorePaginateResult } from "@/interfaces/pagination";
import { ExportService } from "@/services/export.service";
import { MessageEnum } from "@/constants";
import { PaginateResult } from "mongoose";

@Injectable()
export class CoreTransformInterceptor
  implements NestInterceptor<CorePaginateResult> {
  constructor(private readonly exportService: ExportService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<CorePaginateResult> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((result: CoreResponse) => {
        let respStatus: boolean;

        if (isIn(result.status, [true, false])) {
          respStatus = result.status;
        } else {
          respStatus =
            result.status ||
            response.statusCode == HttpStatus.OK ||
            response.statusCode == HttpStatus.CREATED;
        }

        if (!respStatus) {
          response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        // This line must below respStatus check
        const respMessage =
          result.message ||
          (respStatus && MessageEnum.SUCCESS) ||
          MessageEnum.FAILED;
        const respStatusCode = result.statusCode || response.statusCode;

        if (result.excel) {
          /*
                    Export Excel
                     */
          this.exportService.toExcel(response, result, respStatusCode);
        } else {
          if (result.data) {
            // Paging/Single documents
            const paginator = result.data as PaginateResult<any>;
            if (paginator.docs) {
              // Paging documents
              return {
                status: respStatus,
                statusCode: respStatusCode,
                message: respMessage,
                data: {
                  list: paginator.docs,
                  total: paginator.totalDocs,
                  pages: paginator.totalPages,
                  hasNextPage: paginator.hasNextPage,
                  hasPrevPage: paginator.hasPrevPage,
                },
              };
            } else {
              // Single document
              // console.log(result, respStatus);

              return {
                status: respStatus,
                statusCode: respStatusCode,
                message: respMessage,
                data: result.data,
              };
            }
          } else {
            // No return data
            return {
              status: respStatus,
              statusCode: respStatusCode,
              message: respMessage,
              data: null,
            };
          }
        }
      })
    );
  }
}
