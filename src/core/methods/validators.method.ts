import * as bcrypt from "bcrypt";
import {CredentialEntity} from "../../api/v1/auth/entities/credential.entity";
// import { IUser } from "@/core/interfaces/employee.interface";

const SALT_ROUND = 10;

export function validPassword(this: CredentialEntity, password: string) {
  return bcrypt.compare(password, this.password);
}

export const generateHash = async (password: string) => {
  const salt = await bcrypt.genSalt(SALT_ROUND);
  return bcrypt.hash(password, salt);
};
