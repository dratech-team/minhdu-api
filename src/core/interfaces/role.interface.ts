import { ICustomDocument } from "./mongodb.interface";
// import { USER_TYPE } from "@/core/constants/role-type.constant";
import { ObjectId } from "mongodb";
import { USER_TYPE } from "../constants/role-type.constant";

export interface IRole extends ICustomDocument {
  readonly type: USER_TYPE;
  readonly userId: ObjectId;
}
