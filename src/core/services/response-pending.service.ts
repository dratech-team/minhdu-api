import { Injectable } from "@nestjs/common";
import { Response as ExpressResponse } from "express";
import * as UniqueIdGenerator from "uniqid";
import { IResponsePending } from "@/core/interfaces/response-pending.interface";

@Injectable()
export class ResponsePendingService {
  private responsesPendingList: IResponsePending[] = [];

  constructor() {}

  add(res: ExpressResponse): IResponsePending {
    const responsePending = {
      id: UniqueIdGenerator(),
      res,
    };
    this.responsesPendingList.push(responsePending);
    return responsePending;
  }

  /**
   * @description get response by id and remove it from list
   */
  retrieve(id: string): IResponsePending {
    const index = this.responsesPendingList.findIndex(
      (responsePending) => responsePending.id === id
    );
    return this.responsesPendingList.splice(index, 1)?.shift() || null;
  }
}
