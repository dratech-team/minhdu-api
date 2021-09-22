import { ICustomDocument } from "./mongodb.interface";
import { IUserMethods } from "../methods/user.method";
import {Role} from "@prisma/client";

export interface IUser extends ICustomDocument, IUserMethods {
  email: string;
  password: string;

  userType: Role;
}
