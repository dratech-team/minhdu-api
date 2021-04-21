import {UserType} from "../../../../core/constants/role-type.constant";
import {ObjectId} from "mongodb";
import {JwtType} from "../../../../core/constants/jwt.constant";
import {IUserMethods} from "../methods/auth.method";

export interface JwtPayload extends IUserMethods{
  readonly userId: ObjectId;
  readonly jwtType: JwtType;
  readonly role: UserType;
}
