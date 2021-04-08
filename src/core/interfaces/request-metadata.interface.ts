import { REQUEST_METHOD } from "@/core/constants/request-method.constant";

export interface IRequestMetadata {
  method: REQUEST_METHOD;
  url: string;
}
