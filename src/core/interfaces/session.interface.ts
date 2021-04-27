import { ICustomDocument } from "./mongodb.interface";
import { IUser } from "./user.interface";

export interface ISession extends ICustomDocument {
  accessToken: string;
  user?: IUser;
  userId: string;
  restricted?: boolean;
  installationId?: string;
  expiresAt: Date;

  // Indicate that this refresh token is forced to be expired due to employee already deleted
  isUserDeleted: boolean;
}
