import { ICommonResultMongo } from "./common-result-mongo.interface";

export interface IDeleteResultMongo extends ICommonResultMongo {
  deletedCount?: number;
}
