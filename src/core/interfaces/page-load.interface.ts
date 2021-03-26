import { ObjectId } from "mongodb";
import { ICustomDocument } from "./mongodb.interface";

export interface IPageLoadRequest {
  date: Date;
  limit: number;
  totalItems?: number;
  userId?: ObjectId;
}

export interface IPageLoad extends ICustomDocument {
  request: any; // inherit from IPageLoadRequest
  ids: ObjectId[];
  userId: ObjectId;
}

export interface IPageLoadCast<T> extends IPageLoad {
  request: T; // inherit from IPageLoadRequest
}
