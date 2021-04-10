import { ICustomDocument } from "./mongodb.interface";
// import { USER_TYPE } from "@/core/constants/role-type.constant";
import { ObjectId } from "mongodb";
import { UserType } from "../constants/role-type.constant";

export interface IRole extends ICustomDocument {
  readonly type: UserType;
  readonly userId: ObjectId;
}
