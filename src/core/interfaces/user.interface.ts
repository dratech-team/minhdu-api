import { ICustomDocument } from "./mongodb.interface";
import { IUserMethods } from "../methods/user.method";
import { UserType } from "../constants/role-type.constant";

export interface IUser extends ICustomDocument, IUserMethods {
  email: string;
  password: string;

  userType: UserType;
}
