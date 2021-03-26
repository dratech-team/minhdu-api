import { generateHash, validPassword } from "./validators.method";

export const methods = {
  validPassword,
  generateHash,
};

type MethodsType = typeof methods;

export interface IUserMethods extends MethodsType {}
