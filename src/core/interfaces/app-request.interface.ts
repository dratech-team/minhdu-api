import { IProfile } from "./profile.interface";

export interface IAppHeaderRequest extends Headers {
  "x-api-key": string;
  "content-type": string;
}

export interface IAppRequest extends Request {
  user: IProfile;
  route?: {
    path?: string;
  };
  headers: IAppHeaderRequest;
}
