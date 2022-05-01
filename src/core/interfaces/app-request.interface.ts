
export interface IAppHeaderRequest extends Headers {
  "x-api-key": string;
  "content-type": string;
}

export interface IAppRequest extends Request {
  user: any;
  route?: {
    path?: string;
  };
  headers: IAppHeaderRequest;
}
