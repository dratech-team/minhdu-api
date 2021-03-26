import { Response as ExpressResponse } from "express";

export interface IResponsePending {
  id: string;
  res: ExpressResponse;
}
