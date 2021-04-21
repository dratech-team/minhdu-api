import {generateHash, validPassword} from "../../../../core/methods/validators.method";

export const methods = {
  validPassword,
  generateHash,
};

type MethodsType = typeof methods

export interface IUserMethods extends MethodsType {
}
