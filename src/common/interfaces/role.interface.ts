import { ObjectId } from "mongoose";
import { USER_TYPE } from "../constant/role-type.constant";
import { ICustomDocument } from "./mongodb.interface";

export interface IRole extends ICustomDocument {
  readonly type: USER_TYPE;
  readonly userId: ObjectId;
}
