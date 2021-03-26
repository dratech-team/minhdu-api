import { IRole } from "./role.interface";
import { ISession } from "./session.interface";
import { IUser } from "./user.interface";

export interface IProfile {
  user: IUser;
  session: ISession;
  role: IRole;
}
