import { ICustomDocument } from "./mongodb.interface";

export interface ICountMongo extends ICustomDocument {
  count: number;
}
