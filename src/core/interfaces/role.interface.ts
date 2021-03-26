import { ObjectId } from "mongoose";
import { USER_TYPE } from "../constants/role-type.constant";
import { ICustomDocument } from "./mongodb.interface";

export interface IRole extends ICustomDocument {
  readonly type: USER_TYPE;
  readonly userId: ObjectId;
}
