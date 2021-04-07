import { Document, Model } from "mongoose";
import { ObjectId } from "mongodb";

export interface ICustomDocument extends Document {
  _id: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  deletedBy?: ObjectId;
  deleted?: boolean;
  vK?: number;
}

export interface ICustomModel<T extends Document> extends Model<T> {}

export interface IEmbeddedDocument {
  _id: ObjectId;
  vK?: number;
  createdAt?: Date;
  updatedAt?: Date;
  embeddedAt?: Date;
  deleted?: boolean;
}
