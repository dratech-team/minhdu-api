import * as bcrypt from "bcrypt";
import { IUser } from "../interfaces/user.interface";
// import { IUser } from "@/core/interfaces/user.interface";

const SALT_ROUND = 10;

export function validPassword(this: IUser, password: string) {
  return bcrypt.compare(password, this.password);
}

export const generateHash = async (password: string) => {
  const salt = await bcrypt.genSalt(SALT_ROUND);
  return bcrypt.hash(password, salt);
};