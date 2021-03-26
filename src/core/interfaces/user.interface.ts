import { ICustomDocument } from "./mongodb.interface";
import { IUserMethods } from "../methods/user.method";
import { USER_TYPE } from "../constants/role-type.constant";

export interface IUser extends ICustomDocument, IUserMethods {
  email: string;
  password: string;

  userType: USER_TYPE;
}
