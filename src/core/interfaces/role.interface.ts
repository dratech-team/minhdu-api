import { ICustomDocument } from "./mongodb.interface";
import { USER_TYPE } from "@/core/constants/role-type.constant";
import { ObjectId } from "mongodb";

export interface IRole extends ICustomDocument {
  readonly type: USER_TYPE;
  readonly userId: ObjectId;
}
