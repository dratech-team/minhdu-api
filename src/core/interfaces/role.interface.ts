import { ICustomDocument } from "./mongodb.interface";
// import { USER_TYPE } from "@/core/constants/role-type.constant";
import { ObjectId } from "mongodb";
import {Role} from "@prisma/client";

export interface IRole extends ICustomDocument {
  readonly type: Role;
  readonly userId: ObjectId;
}
