import { ICustomDocument } from "./mongodb.interface";

export interface IRequest extends ICustomDocument {
  method: string;
  url: string;
  statusCode: number;
  apiName: string;
  durationTime: number;
  unit: string;
}
