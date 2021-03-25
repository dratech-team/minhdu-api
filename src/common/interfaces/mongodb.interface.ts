import { Document, ObjectId } from "mongoose";

export interface ICustomDocument extends Document {
  _id: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  deletedBy?: ObjectId;
  deleted?: boolean;
  vK?: number;
}
