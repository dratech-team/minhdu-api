import {CredentialEntity} from "../entities/credential.entity";

export interface IUserMethods {
  validPassword(this: CredentialEntity, password: string);

  generateHash(password: string);
}
