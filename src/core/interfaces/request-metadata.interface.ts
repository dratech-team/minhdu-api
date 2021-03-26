import { REQUEST_METHOD } from "@/constants/request-method.constant";

export interface IRequestMetadata {
  method: REQUEST_METHOD;
  url: string;
}
