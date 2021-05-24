import { generateHash } from "./validators.method";

export const methods = {
  generateHash,
};

type MethodsType = typeof methods;

export interface IUserMethods extends MethodsType {}
